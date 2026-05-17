# UML — Class diagram (submission)

This diagram extends the domain view in [`docs/capstone/PHASE1_DOMAIN.md`](../capstone/PHASE1_DOMAIN.md) with **pattern touchpoints** (stereotypes as notes).

```mermaid
classDiagram
  direction TB
  class UserProfile {
    +id string
    +name string
    +email string
    +role Role
    +toPublicDTO()
  }
  class StudentProfile
  class InstructorProfile
  class AdminProfile
  UserProfile <|-- StudentProfile
  UserProfile <|-- InstructorProfile
  UserProfile <|-- AdminProfile

  class Course {
    +id string
    +title string
    +instructorId string
    +modules Module[]
  }
  class Assignment {
    +id string
    +courseId string
    +maxScore number
  }
  class Submission {
    +assignmentId string
    +studentId string
    +fileName string
  }
  InstructorProfile "1" --> "*" Course : owns
  Course "1" --> "*" Assignment : contains
  Assignment "1" --> "*" Submission : receives

  class UserFactory {
    +fromRecord(record) UserProfile
  }
  class CourseBuilder {
    +withBasics() CourseBuilder
    +build(id) Course
  }
  class GradingContext {
    +setStrategy(strategy)
    +execute(payload) GradeResult
  }
  class GradingStrategy
  UserFactory ..> StudentProfile : creates
  UserFactory ..> InstructorProfile : creates
  UserFactory ..> AdminProfile : creates
  CourseBuilder ..> Course : builds
  GradingContext --> GradingStrategy : uses
```

## How to export

1. Copy the fenced block into [mermaid.live](https://mermaid.live) or use a Mermaid-compatible Markdown preview.
2. Export **PNG/SVG** for your PDF or slides.
3. Optionally add to [`docs/screenshots/`](../screenshots/) per [`uml-proof.md`](../screenshots/uml-proof.md).
