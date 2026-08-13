# Course flow

## List

```text
CourseListPage -> courseApi.getCourses -> GET /api/courses -> CourseService -> CourseRepository -> courses.json
```

## Search

```text
CourseListPage -> courseApi.searchCourses -> GET /api/courses/search?keyword=... -> CourseService.searchCourses
```

## Detail

```text
CourseDetailModal -> courseApi.getCourseById -> GET /api/courses/{courseId}
```

