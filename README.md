# Job Service Documentation

## Overview
The **Job Service** is a backend module built using **NestJS** and **Mongoose** to handle CRUD operations for job postings. It includes authentication, throttling, and structured job search capabilities while adhering to **SOLID principles** and **design patterns** for maintainability and scalability.

---

## **1. SOLID Principles in Job Service**
### **1.1 Single Responsibility Principle (SRP)**
Each class in the service has a single, well-defined responsibility:
- `JobsService` handles business logic for job management.
- `JobsController` is responsible for handling API requests and responses.
- `JobsModule` configures dependencies and modules.

### **1.2 Open/Closed Principle (OCP)**
The system is designed to be **extensible without modifying existing code**. For instance:
- The `search` function allows adding new filters without modifying the core logic.
- The `JobSchema` structure supports dynamic extensions via the `extras` field.

### **1.3 Liskov Substitution Principle (LSP)**
- Interfaces such as `JobServiceInterface` ensure that different job service implementations can be substituted without breaking functionality.

### **1.4 Interface Segregation Principle (ISP)**
- The controller and service implement only the methods they require, avoiding unnecessary dependencies.

### **1.5 Dependency Inversion Principle (DIP)**
- The service depends on an abstract `Model<Job>` injected using `@InjectModel`, which allows for easy database implementation swapping.

---

## **2. Design Patterns Used**
### **2.1 Repository Pattern**
- `JobsService` acts as a repository for database operations, separating data access logic from the controller.

### **2.2 Factory Pattern**
- The `JobSchema` includes a UUID generator for `_id`, ensuring unique job entries.

### **2.3 Strategy Pattern**
- The `search` function dynamically applies different sorting and filtering rules, making it adaptable to changes.

---

## **3. Modules and Dependencies**
### **3.1 JobsModule**
The `JobsModule` is responsible for importing dependencies, defining the service, and setting up controllers.

```typescript
@Module({
  imports: [MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }])],
  providers: [JobsService],
  controllers: [JobsController],
})
export class JobsModule {}
```

### **3.2 Dependencies Used**
- **@nestjs/mongoose** – For MongoDB integration using Mongoose.
- **@nestjs/throttler** – For API rate limiting.
- **@nestjs/passport** – For authentication.
- **uuid** – To generate unique job IDs.

---

## **4. Schema Definition**
The `JobSchema` defines the structure of job postings.

```typescript
export const JobSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  jobType: { type: String, required: true },
  salary: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  benefits: [String],
  extras: Schema.Types.Mixed,
  createdAt: { type: Date, default: () => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }},
});
```

---

## **5. Job Service**
Handles job management logic, including CRUD operations and search capabilities.

### **5.1 Create Job**
```typescript
async create(jobData: Job): Promise<Job> {
  const job = new this.jobModel(jobData);
  return job.save();
}
```

### **5.2 Find Jobs with Pagination**
```typescript
async findAll(page = 1, limit = 10): Promise<Job[]> {
  const skip = (page - 1) * limit;
  return this.jobModel.find().skip(skip).limit(limit).exec();
}
```

### **5.3 Search Jobs with Filters**
1. Posts created in the last 7 days rank first above older posts
2. Posts with higher salaries rank first above posts with lower salaries
3. Posts made by companies with more open job posts rank first than those for companies
with less posts
```

---

## **6. Job Controller**
Handles API endpoints for job operations.

### **6.1 Create Job Endpoint**
```typescript
@Post()
create(@Body() jobData: Job): Promise<Job> {
  return this.jobsService.create(jobData);
}
```

### **6.2 Get All Jobs**
```typescript
@Get()
findAll(@Query('page') page = 1, @Query('limit') limit = 10): Promise<Job[]> {
  return this.jobsService.findAll(page, limit);
}
```

### **6.3 Search Jobs**
```typescript
@Get('search')
search(@Query() query: any): Promise<Job[]> {
  return this.jobsService.search(query);
}
```

---

## **7. Rate Limiting (Throttling)**
Throttling is applied to prevent abuse:
- **POST**: Max 5 requests per minute
- **GET** (All Jobs): Max 10 requests per minute
- **GET** (Search): Max 5 requests per minute
```typescript
@Throttle({ default: { limit: 5, ttl: 60 } })
```

## **7. Authentication**
JWT is a secure way to authenticate users via tokens. The token is signed and contains user info.

How it works:

Login: User provides credentials, server returns a JWT.
Access: User sends JWT in headers for each request.
Validation: Server verifies JWT before granting access.
---

## **8. Shutdown Behavior**
Deletes all jobs when the server is shutting down.
```typescript
async beforeApplicationShutdown(signal?: string): Promise<void> {
  console.log(`Server shutting down due to ${signal}`);
  await this.jobModel.deleteMany({}).exec();
}
```