(() => {
  const COURSE_STORAGE_KEY = window.Auth?.STORAGE_KEYS?.courses || "courses";
  const DEFAULT_VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
  const IMAGE_FALLBACK_URL = "https://picsum.photos/seed/fallback/800/500";
  const REMOVED_COURSE_TITLES = new Set([
    "ემოციური წიგნიერება",
    "ოჯახური კომუნიკაცია",
    "შემოქმედებითი თვითგამოხატვა",
    "სტრესთან გამკლავება",
  ]);
  const FILTERABLE_CATEGORIES = ["არტთერაპია", "მშობლებისთვის", "კომუნიკაცია", "ფსიქოლოგია"];
  const BASE_COURSES = [
    {
      id: 1,
      title: "არტთერაპია",
      cat: "არტთერაპია",
      free: true,
      lessons: 12,
      hours: 8,
      desc: "შემოქმედებითი გამოხატვა ფსიქოლოგიური ჯანმრთელობისთვის",
      fullDescription:
        "კურსი გაჩვენებს, როგორ შეიძლება ფერი, ფორმა და ვიზუალური თხრობა იქცეს თვითგამოხატვის, ემოციური განტვირთვისა და შინაგანი სიცხადის ინსტრუმენტად.",
      freeLessons: 12,
      price: 0,
      originalPrice: 0,
      image: "../images/home/art-theraphy.webp",
      imageFallback: "../images/home/art-theraphy.webp",
      imageAlt: "არტთერაპიისთვის განკუთვნილი ფერადი შემოქმედებითი მასალები",
      heroImage: "https://mentalist.wpengine.com/wp-content/uploads/2025/08/Mentalist-Slider-img-02.jpg",
      rating: 4.9,
      reviewCount: 24,
      students: 182,
      sales: 182,
    },
    {
      id: 2,
      title: "კურსი მშობლებისთვის",
      cat: "მშობლებისთვის",
      free: false,
      lessons: 18,
      hours: 14,
      desc: "ეფექტური მშობლობის ფსიქოლოგია",
      fullDescription:
        "პრაქტიკული კურსი მშობლებისთვის, ვინც უფრო მშვიდ, თანმიმდევრულ და ემპათიურ ყოველდღიურ კომუნიკაციას აშენებს ბავშვთან და ოჯახთან.",
      freeLessons: 2,
      price: 120,
      originalPrice: 180,
      image: "../images/home/course-for-parents.jpg",
      imageFallback: "../images/home/course-for-parents.jpg",
      imageAlt: "მშობელი და ბავშვი ყურადღებიანი კომუნიკაციის პროცესში",
      heroImage: "https://mentalist.wpengine.com/wp-content/uploads/2025/08/Mentalist-Service-img-01.jpg",
      rating: 4.8,
      reviewCount: 31,
      students: 146,
      sales: 91,
    },
    {
      id: 3,
      title: "ინტერპერსონალური კომუნიკაცია",
      cat: "კომუნიკაცია",
      free: false,
      lessons: 10,
      hours: 7,
      desc: "ურთიერთობებში სიცხადე, მოსმენა და თავდაჯერებული საუბარი",
      fullDescription:
        "კურსი გაძლიერებს საუბრის კულტურას, აქტიურ მოსმენას და საზღვრების დაყენების უნარს როგორც პირად, ისე პროფესიულ ურთიერთობებში.",
      freeLessons: 2,
      price: 90,
      originalPrice: 0,
      image: "../images/home/interpersonal.jpeg",
      imageFallback: "../images/home/interpersonal.jpeg",
      imageAlt: "ორი ადამიანი დიალოგისა და ურთიერთკავშირის პროცესში",
      heroImage: "https://mentalist.wpengine.com/wp-content/uploads/2025/08/Mentalist-Service-img-02.jpg",
      rating: 4.8,
      reviewCount: 18,
      students: 128,
      sales: 77,
    },
    {
      id: 4,
      title: "ფსიქოლოგიის საფუძვლები",
      cat: "ფსიქოლოგია",
      free: true,
      lessons: 8,
      hours: 5,
      desc: "ძირითადი ცნებები, მიდგომები და ფსიქოლოგიური ხედვა",
      fullDescription:
        "საწყისი კურსი მათთვის, ვისაც უნდა გაიცნოს თანამედროვე ფსიქოლოგიის ძირითადი მიმართულებები, ადამიანის ქცევის საფუძვლები და ემოციური პროცესები.",
      freeLessons: 8,
      price: 0,
      originalPrice: 0,
      image: "../images/home/pyschology.jpeg",
      imageFallback: "../images/home/pyschology.jpeg",
      imageAlt: "ფსიქოლოგიის საფუძვლების სასწავლო და დაკვირვების კონტექსტი",
      heroImage: "https://mentalist.wpengine.com/wp-content/uploads/2025/12/Mentalist-Breadcrumb.jpg",
      rating: 4.9,
      reviewCount: 42,
      students: 244,
      sales: 244,
    },
    {
      id: 7,
      title: "შემოქმედებითი თვითგამოხატვა",
      cat: "არტთერაპია",
      free: true,
      lessons: 9,
      hours: 6,
      desc: "ფანტაზიის, ისტორიებისა და ვიზუალური სავარჯიშოების გზით",
      fullDescription:
        "უფასო პრაქტიკული კურსი, რომელიც არტთერაპიის სავარჯიშოებით გაძლევს სივრცეს გამოხატო ის, რასაც სიტყვებით ვერ ამბობ და უფრო ახლოს მიხვიდე საკუთარ ხმასთან.",
      freeLessons: 9,
      price: 0,
      originalPrice: 0,
      image: "https://mentalist.wpengine.com/wp-content/uploads/2025/08/Home-slider-01.jpg",
      imageFallback: "https://picsum.photos/seed/creativeexpression/400/225",
      imageAlt: "შემოქმედებითი თვითგამოხატვისთვის განკუთვნილი ფერადი სამუშაო სივრცე",
      heroImage: "https://mentalist.wpengine.com/wp-content/uploads/2025/08/Home-slider-01.jpg",
      rating: 4.9,
      reviewCount: 19,
      students: 164,
      sales: 164,
    },
    {
      id: 8,
      title: "სტრესთან გამკლავება",
      cat: "ფსიქოლოგია",
      free: false,
      lessons: 13,
      hours: 9,
      desc: "სტრესის ამოცნობა, დაძაბულობის შემცირება და აღდგენა",
      fullDescription:
        "კურსი ეყრდნობა სტრესის მართვის თანამედროვე მიდგომებს და გაძლევს პრაქტიკულ რუტინებს, რომ სწრაფად დაიბრუნო კონცენტრაცია და ემოციური სტაბილურობა.",
      freeLessons: 2,
      price: 130,
      originalPrice: 170,
      image: "https://mentalist.wpengine.com/wp-content/uploads/2025/08/Mentalist-Slider-img-02.jpg",
      imageFallback: "https://picsum.photos/seed/stresscourse/400/225",
      imageAlt: "სიმშვიდისა და სტრესთან გამკლავების პრაქტიკის ამსახველი გარემო",
      heroImage: "https://mentalist.wpengine.com/wp-content/uploads/2025/08/Mentalist-Slider-img-02.jpg",
      rating: 4.8,
      reviewCount: 22,
      students: 121,
      sales: 74,
    },
  ];

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function renderArrowIcon(direction = "up-right", className = "") {
    const icons = {
      right:
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 8h10"></path><path d="m9 4 4 4-4 4"></path></svg>',
      "up-right":
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 12 12 4"></path><path d="M6 4h6v6"></path></svg>',
    };
    const classes = ["icon-arrow", `icon-arrow--${direction}`, className].filter(Boolean).join(" ");
    return `<span class="${classes}" aria-hidden="true">${icons[direction] || icons["up-right"]}</span>`;
  }

  function debounce(callback, wait = 150) {
    let timeoutId = 0;

    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => callback(...args), wait);
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function uid(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function readStorageValue(key, fallback) {
    try {
      const rawValue = window.localStorage.getItem(key);
      return rawValue ? JSON.parse(rawValue) : clone(fallback);
    } catch (error) {
      return clone(fallback);
    }
  }

  function writeStorageValue(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  function toCurrency(amount) {
    return Number(amount) > 0 ? `₾${Number(amount)}` : "უფასო";
  }

  function countCompletedTasks(taskState = {}) {
    return Object.values(taskState).filter(Boolean).length;
  }

  function buildLessonTitle(course, sectionIndex, lessonNumberInCourse, lessonNumberInSection) {
    const titleGroups = [
      ["ორიენტაცია კურსში", "თემის რუკა", "უსაფრთხო სივრცის შექმნა"],
      ["საფუძვლების გააქტიურება", "ქცევისა და ემოციის კავშირი", "მთავარი პატერნების დანახვა", "რეალურ შემთხვევებზე დაკვირვება"],
      ["სავარჯიშო ყოველდღიურობაში", "რეფლექსია და დღიური", "ურთიერთობაში გამოყენება", "შეჯამება", "შემდეგი ნაბიჯები"],
    ];
    const group = titleGroups[Math.min(sectionIndex, titleGroups.length - 1)];
    const base = group[(lessonNumberInSection - 1) % group.length];

    return `გაკვეთილი ${lessonNumberInCourse}: ${course.title} — ${base}`;
  }

  function buildLessonTasks(course, lessonNumber) {
    return [
      {
        title: "დაკვირვების დღიური",
        details: `${course.title}-ის ამ თემაზე ჩაიწერე 3 მოკლე დაკვირვება შენი ყოველდღიურობიდან. ყურადღება მიაქციე რას გრძნობ, რას ფიქრობ და რა რეაქცია გაქვს სხეულში.`,
      },
      {
        title: "პრაქტიკული სავარჯიშო",
        details: `შეასრულე ერთი კონკრეტული ტექნიკა, რომელიც გაკვეთილში განიხილა მაკა გორდელაძემ, და აღწერე რა შეიცვალა 10-15 წუთის შემდეგ.`,
      },
      {
        title: "რეფლექსია",
        details: `დაფიქრდი, რა იყო ამ გაკვეთილში შენთვის ყველაზე მნიშვნელოვანი აზრი. შეგიძლია ატვირთო ფოტოც, თუ ჩანაწერი, ნახატი ან ვიზუალური პასუხი გააკეთე.`,
      },
    ].map((task, index) => ({
      id: `task-${lessonNumber}-${index + 1}`,
      ...task,
    }));
  }

  function getSectionLessonCounts(totalLessons) {
    const counts = [];
    let remaining = Number(totalLessons || 0);

    if (remaining <= 0) {
      return counts;
    }

    const first = Math.min(3, remaining);
    counts.push(first);
    remaining -= first;

    if (remaining > 0) {
      const second = Math.min(4, remaining);
      counts.push(second);
      remaining -= second;
    }

    if (remaining > 0) {
      counts.push(remaining);
    }

    return counts;
  }

  function buildReviews(course) {
    const people = [
      { name: "ნინო კვარაცხელია", role: "სტუდენტი" },
      { name: "მარიამ წერეთელი", role: "მშობელი" },
      { name: "ანა ბერიძე", role: "HR სპეციალისტი" },
    ];

    return people.map((person, index) => ({
      id: `${course.id}-review-${index + 1}`,
      name: person.name,
      role: person.role,
      rating: index === 2 ? 4 : 5,
      comment:
        index === 0
          ? `კურსმა ძალიან გასაგებად დამანახვა ${course.cat.toLowerCase()} მიმართულებით ის ნაბიჯები, რომლებიც რეალურ ცხოვრებაში მუშაობს.`
          : index === 1
            ? "გაკვეთილები არის თბილი, პრაქტიკული და ზედმეტი თეორიის გარეშე. განსაკუთრებით დამეხმარა სავარჯიშოების ნაწილი."
            : "ვიდეოები მოკლე და კონცენტრირებულია. დავალებების შესრულებამ კურსის იდეები ყოველდღიურობაში მართლა მომატანა.",
    }));
  }

  function buildCourse(meta) {
    const sectionTitles = ["შესავალი", "საფუძვლები", "პრაქტიკა"];
    const lessonCounts = getSectionLessonCounts(meta.lessons);
    let lessonNumber = 1;

    const sections = lessonCounts.map((count, sectionIndex) => {
      const sectionId = `course-${meta.id}-section-${sectionIndex + 1}`;
      const lessons = [];

      for (let lessonIndex = 0; lessonIndex < count; lessonIndex += 1) {
        const currentLessonNumber = lessonNumber;
        const minutes = 12 + ((meta.id * 5 + lessonNumber * 3) % 12);
        lessons.push({
          id: `course-${meta.id}-lesson-${currentLessonNumber}`,
          title: buildLessonTitle(meta, sectionIndex, currentLessonNumber, lessonIndex + 1),
          duration: `${minutes} წთ`,
          minutes,
          videoUrl: DEFAULT_VIDEO_URL,
          poster: meta.image,
          description:
            `${meta.title}-ის ამ გაკვეთილში მაკა გორდელაძე ხსნის მთავარ ფსიქოლოგიურ პრინციპებს, რეალურ მაგალითებს და იმ ნაბიჯებს, რომლებიც შეგიძლია ყოველდღიურობაში გამოიყენო. ` +
            "გაკვეთილი აერთიანებს თეორიას, რეფლექსიას და მარტივ სავარჯიშოებს, რომ ცოდნა პრაქტიკაში გადაიტანო.",
          tasks: buildLessonTasks(meta, currentLessonNumber),
          isFree: meta.free || currentLessonNumber <= Number(meta.freeLessons || 0),
        });
        lessonNumber += 1;
      }

      return {
        id: sectionId,
        title: sectionTitles[sectionIndex] || `სექცია ${sectionIndex + 1}`,
        lessons,
      };
    });

    return {
      ...meta,
      image: meta.image,
      heroImage: meta.heroImage || meta.image,
      reviews: buildReviews(meta),
      sections,
      instructor: "მაკა გორდელაძე",
      instructorRole: "ფსიქოლოგი | პედაგოგი",
      students: meta.students || 120,
      rating: meta.rating || 4.8,
      reviewCount: meta.reviewCount || 18,
      sales: Number(meta.sales || 0),
    };
  }

  const DEFAULT_COURSES = BASE_COURSES.filter((course) => !REMOVED_COURSE_TITLES.has(course.title)).map(buildCourse);
  const DEFAULT_COURSE_MAP = new Map(DEFAULT_COURSES.map((course) => [String(course.id), course]));
  const DEFAULT_COURSE_MEDIA = new Map(
    DEFAULT_COURSES.map((course) => [
      String(course.id),
      {
        image: course.image,
        imageFallback: course.imageFallback,
        imageAlt: course.imageAlt || course.title,
      },
    ]),
  );

  function syncCourseMedia(course) {
    if (!course || typeof course !== "object") {
      return course;
    }

    const defaultMedia = DEFAULT_COURSE_MEDIA.get(String(course.id));

    if (!defaultMedia) {
      return course;
    }

    const nextCourse = {
      ...course,
      image: defaultMedia.image,
      imageFallback: defaultMedia.imageFallback,
      imageAlt: defaultMedia.imageAlt,
    };

    if (Array.isArray(course.sections)) {
      nextCourse.sections = course.sections.map((section) => ({
        ...section,
        lessons: normalizeArray(section.lessons).map((lesson) => ({
          ...lesson,
          poster: defaultMedia.image,
        })),
      }));
    }

    return nextCourse;
  }

  function syncCourseWithDefaults(course) {
    if (!course || typeof course !== "object") {
      return course;
    }

    const defaultCourse = DEFAULT_COURSE_MAP.get(String(course.id));

    if (!defaultCourse) {
      return course;
    }

    return {
      ...defaultCourse,
      ...course,
      title: defaultCourse.title,
      cat: defaultCourse.cat,
      desc: defaultCourse.desc,
      fullDescription: defaultCourse.fullDescription,
      image: defaultCourse.image,
      imageFallback: defaultCourse.imageFallback,
      imageAlt: defaultCourse.imageAlt,
      heroImage: defaultCourse.heroImage,
      lessons: defaultCourse.lessons,
      hours: defaultCourse.hours,
      freeLessons: defaultCourse.freeLessons,
      free: defaultCourse.free,
      sections: defaultCourse.sections,
      reviews: defaultCourse.reviews,
      instructor: defaultCourse.instructor,
      instructorRole: defaultCourse.instructorRole,
      rating: defaultCourse.rating,
      reviewCount: defaultCourse.reviewCount,
      students: defaultCourse.students,
      sales: Number.isFinite(Number(course.sales)) ? Number(course.sales) : Number(defaultCourse.sales || 0),
      price: Number.isFinite(Number(course.price)) ? Number(course.price) : Number(defaultCourse.price || 0),
      originalPrice: Number.isFinite(Number(course.originalPrice))
        ? Number(course.originalPrice)
        : Number(defaultCourse.originalPrice || 0),
    };
  }

  function seedCourses() {
    const existing = readStorageValue(COURSE_STORAGE_KEY, []);

    if (!Array.isArray(existing) || !existing.length) {
      writeStorageValue(COURSE_STORAGE_KEY, DEFAULT_COURSES);
      return clone(DEFAULT_COURSES);
    }

    const normalized = existing
      .filter((course) => !REMOVED_COURSE_TITLES.has(String(course?.title || "")))
      .map((course) => syncCourseMedia(syncCourseWithDefaults(course?.sections ? course : buildCourse(course))));

    DEFAULT_COURSES.forEach((course) => {
      if (!normalized.some((item) => String(item.id) === String(course.id))) {
        normalized.push(clone(course));
      }
    });

    writeStorageValue(COURSE_STORAGE_KEY, normalized);
    return normalized;
  }

  function getCourses() {
    return seedCourses();
  }

  function saveCourses(courses) {
    return writeStorageValue(COURSE_STORAGE_KEY, courses);
  }

  function getCourseById(courseId) {
    return getCourses().find((course) => String(course.id) === String(courseId)) || null;
  }

  function flattenLessons(course) {
    return normalizeArray(course?.sections).flatMap((section) =>
      normalizeArray(section.lessons).map((lesson) => ({
        ...lesson,
        sectionId: section.id,
        sectionTitle: section.title,
      })),
    );
  }

  function getCurrentUser() {
    return window.Auth?.getCurrentUser?.() || null;
  }

  function getEnrollment(user, courseId) {
    return normalizeArray(user?.enrolledCourses).find((entry) => Number(entry.courseId) === Number(courseId)) || null;
  }

  function updateEnrollment(courseId, updater) {
    const currentUser = getCurrentUser();

    if (!currentUser || typeof updater !== "function") {
      return null;
    }

    const enrollments = normalizeArray(currentUser.enrolledCourses).map((entry) => ({
      ...entry,
      progress: entry?.progress && typeof entry.progress === "object" ? entry.progress : {},
      taskState: entry?.taskState && typeof entry.taskState === "object" ? entry.taskState : {},
    }));

    const index = enrollments.findIndex((entry) => Number(entry.courseId) === Number(courseId));
    const baseEntry =
      index >= 0
        ? clone(enrollments[index])
        : {
            courseId: Number(courseId),
            enrolledAt: new Date().toISOString(),
            purchasedAt: "",
            progress: {},
            taskState: {},
          };

    const nextEntry = updater(baseEntry);

    if (!nextEntry) {
      return null;
    }

    if (index >= 0) {
      enrollments[index] = nextEntry;
    } else {
      enrollments.push(nextEntry);
    }

    window.Auth?.updateCurrentUser?.({ enrolledCourses: enrollments });
    return nextEntry;
  }

  function ensureEnrollment(course, options = {}) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const existing = getEnrollment(currentUser, course.id);
    if (existing) {
      return existing;
    }

    return updateEnrollment(course.id, (entry) => ({
      ...entry,
      enrolledAt: entry.enrolledAt || new Date().toISOString(),
      purchasedAt: options.purchased ? new Date().toISOString() : entry.purchasedAt || "",
      progress: entry.progress || {},
      taskState: entry.taskState || {},
    }));
  }

  function hasCourseAccess(course, user = getCurrentUser()) {
    return Boolean(course?.free || getEnrollment(user, course?.id));
  }

  function hasLessonAccess(course, lessonId, user = getCurrentUser()) {
    if (!course) {
      return false;
    }

    const lessonIndex = flattenLessons(course).findIndex((lesson) => lesson.id === lessonId);
    return hasCourseAccess(course, user) || lessonIndex < Number(course.freeLessons || 0);
  }

  function findLesson(course, lessonId) {
    return flattenLessons(course).find((lesson) => lesson.id === lessonId) || null;
  }

  function getLessonCompletionState(enrollment, lessonId) {
    if (!enrollment?.progress) {
      return false;
    }

    const value = enrollment.progress[lessonId];
    if (typeof value === "boolean") {
      return value;
    }

    return Boolean(value?.completed);
  }

  function getCompletedLessonsCount(course, user = getCurrentUser()) {
    const enrollment = getEnrollment(user, course.id);

    if (!enrollment) {
      return 0;
    }

    return flattenLessons(course).filter((lesson) => getLessonCompletionState(enrollment, lesson.id)).length;
  }

  function getCourseProgress(course, user = getCurrentUser()) {
    const totalLessons = flattenLessons(course).length;

    if (!totalLessons) {
      return 0;
    }

    return Math.round((getCompletedLessonsCount(course, user) / totalLessons) * 100);
  }

  function updateTaskState(course, lessonId, taskIndex, checked) {
    const lesson = findLesson(course, lessonId);

    if (!lesson) {
      return null;
    }

    return updateEnrollment(course.id, (entry) => {
      const nextTaskState = {
        ...entry.taskState,
        [lessonId]: {
          ...(entry.taskState?.[lessonId] || {}),
          [taskIndex]: checked,
        },
      };
      const completedTasks = countCompletedTasks(nextTaskState[lessonId]);
      const isLessonComplete = completedTasks >= normalizeArray(lesson.tasks).length;

      return {
        ...entry,
        taskState: nextTaskState,
        progress: {
          ...(entry.progress || {}),
          [lessonId]: { completed: isLessonComplete },
        },
      };
    });
  }

  function markLessonCompleted(course, lessonId) {
    return updateEnrollment(course.id, (entry) => ({
      ...entry,
      progress: {
        ...(entry.progress || {}),
        [lessonId]: { completed: true },
      },
    }));
  }

  function getTaskChecked(user, courseId, lessonId, taskIndex) {
    const enrollment = getEnrollment(user, courseId);
    return Boolean(enrollment?.taskState?.[lessonId]?.[taskIndex]);
  }

  function getTaskUpload(user, courseId, lessonId, taskIndex) {
    return (
      normalizeArray(user?.taskUploads).find(
        (entry) =>
          Number(entry.courseId) === Number(courseId) &&
          entry.lessonId === lessonId &&
          Number(entry.taskIndex) === Number(taskIndex),
      ) || null
    );
  }

  function saveTaskUpload(courseId, lessonId, taskIndex, imageBase64) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const nextUploads = normalizeArray(currentUser.taskUploads).filter(
      (entry) =>
        !(
          Number(entry.courseId) === Number(courseId) &&
          entry.lessonId === lessonId &&
          Number(entry.taskIndex) === Number(taskIndex)
        ),
    );

    nextUploads.push({
      id: uid("upload"),
      courseId: Number(courseId),
      lessonId,
      taskIndex: Number(taskIndex),
      imageBase64,
    });

    window.Auth?.updateCurrentUser?.({ taskUploads: nextUploads });
    return imageBase64;
  }

  function escapeRegExp(value) {
    return String(value ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function formatFileSize(bytes) {
    const size = Number(bytes || 0);

    if (!Number.isFinite(size) || size <= 0) {
      return "";
    }

    if (size >= 1024 * 1024) {
      const megabytes = size / (1024 * 1024);
      return `${megabytes >= 10 ? megabytes.toFixed(0) : megabytes.toFixed(1)} MB`;
    }

    if (size >= 1024) {
      return `${Math.round(size / 1024)} KB`;
    }

    return `${size} B`;
  }

  function formatDateTime(value) {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("ka-GE", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  function getLessonShortTitle(course, lesson) {
    const fallback = String(lesson?.title || "").trim();

    if (!fallback) {
      return "";
    }

    const pattern = new RegExp(`^გაკვეთილი\\s+\\d+:\\s*${escapeRegExp(course?.title || "")}\\s*[—-]\\s*`, "u");
    const compactTitle = fallback.replace(pattern, "").replace(/^გაკვეთილი\s+\d+:\s*/u, "").trim();

    return compactTitle || fallback;
  }

  function getPreferredOpenTaskIndex(course, lessonId, user = getCurrentUser()) {
    const lesson = findLesson(course, lessonId);
    const tasks = normalizeArray(lesson?.tasks);

    if (!tasks.length) {
      return -1;
    }

    const firstIncomplete = tasks.findIndex((task, index) => !getTaskChecked(user, course.id, lessonId, index));
    return firstIncomplete >= 0 ? firstIncomplete : 0;
  }

  function getCompletedTaskCount(course, lessonId, user = getCurrentUser()) {
    const lesson = findLesson(course, lessonId);
    return normalizeArray(lesson?.tasks).filter((task, index) => getTaskChecked(user, course.id, lessonId, index)).length;
  }

  function getTaskStatusLabel(checked, isOpen) {
    if (checked) {
      return "შესრულებულია";
    }

    if (isOpen) {
      return "მიმდინარეობს";
    }

    return "დასაწყები";
  }

  function getTaskHelperText(index) {
    const helperTexts = [
      "დაწერე მოკლე დაკვირვება ან გამოცდილება.",
      "სცადე პრაქტიკაში და დააფიქსირე შედეგი.",
      "ატვირთე ფოტო, ჩანაწერი ან მოკლე შეჯამება.",
    ];

    return helperTexts[index % helperTexts.length];
  }

  function normalizeSubmissionAttachment(rawAttachment = {}) {
    const type = String(rawAttachment.type || "application/octet-stream");

    return {
      id: rawAttachment.id || uid("attachment"),
      name: String(rawAttachment.name || "ფაილი").trim(),
      type,
      size: Number(rawAttachment.size || 0),
      dataUrl: String(rawAttachment.dataUrl || rawAttachment.imageBase64 || ""),
      isImage: Boolean(rawAttachment.isImage || type.startsWith("image/")),
    };
  }

  function normalizeLessonSubmission(rawSubmission = {}) {
    return {
      id: rawSubmission.id || uid("submission"),
      courseId: Number(rawSubmission.courseId || 0),
      lessonId: String(rawSubmission.lessonId || ""),
      text: String(rawSubmission.text || "").trim(),
      attachments: normalizeArray(rawSubmission.attachments).map(normalizeSubmissionAttachment),
      submittedAt: String(rawSubmission.submittedAt || ""),
      updatedAt: String(rawSubmission.updatedAt || rawSubmission.submittedAt || ""),
    };
  }

  function createSubmissionAttachment(file, dataUrl) {
    const type = String(file?.type || "application/octet-stream");

    return normalizeSubmissionAttachment({
      id: uid("attachment"),
      name: String(file?.name || "ფაილი"),
      type,
      size: Number(file?.size || 0),
      dataUrl,
      isImage: type.startsWith("image/"),
    });
  }

  function getLessonSubmission(user, courseId, lessonId) {
    return (
      normalizeArray(user?.lessonSubmissions)
        .map(normalizeLessonSubmission)
        .find((entry) => Number(entry.courseId) === Number(courseId) && entry.lessonId === lessonId) || null
    );
  }

  function saveLessonSubmission(courseId, lessonId, payload = {}) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const timestamp = new Date().toISOString();
    const existing = getLessonSubmission(currentUser, courseId, lessonId);
    const nextSubmissions = normalizeArray(currentUser.lessonSubmissions)
      .map(normalizeLessonSubmission)
      .filter((entry) => !(Number(entry.courseId) === Number(courseId) && entry.lessonId === lessonId));

    const submission = normalizeLessonSubmission({
      id: existing?.id || payload.id || uid("submission"),
      courseId,
      lessonId,
      text: payload.text,
      attachments: payload.attachments,
      submittedAt: existing?.submittedAt || payload.submittedAt || timestamp,
      updatedAt: timestamp,
    });

    nextSubmissions.push(submission);
    window.Auth?.updateCurrentUser?.({ lessonSubmissions: nextSubmissions });

    return submission;
  }

  function buildMentorComment(course, lesson) {
    const lessonTitle = getLessonShortTitle(course, lesson);

    return {
      id: `mentor-${lesson.id}`,
      authorType: "mentor",
      authorName: course.instructor || "მაკა გორდელაძე",
      authorRole: "მენტორის რჩევა",
      createdAt: "",
      message: `ვიდეოს შემდეგ მოკლედ დაწერე, შენთვის რას ნიშნავდა "${lessonTitle}" და რომელი სავარჯიშო სცადე პრაქტიკაში. თუ გაქვს ნამუშევარი, ერთი-ორი ფოტო სრულიად საკმარისია.`,
    };
  }

  function getStoredLessonComments(user, courseId, lessonId) {
    return normalizeArray(user?.lessonComments)
      .filter((entry) => Number(entry.courseId) === Number(courseId) && String(entry.lessonId || "") === String(lessonId || ""))
      .map((entry) => ({
        id: entry.id || uid("comment"),
        authorType: entry.authorType === "mentor" ? "mentor" : "student",
        authorName: String(entry.authorName || "").trim() || "თქვენ",
        authorRole: String(entry.authorRole || "").trim() || "მსმენელი",
        createdAt: String(entry.createdAt || ""),
        message: String(entry.message || "").trim(),
      }))
      .filter((entry) => entry.message)
      .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
  }

  function addLessonComment(courseId, lessonId, message) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const trimmedMessage = String(message || "").trim();

    if (!trimmedMessage) {
      return null;
    }

    const comment = {
      id: uid("comment"),
      courseId: Number(courseId),
      lessonId,
      authorType: "student",
      authorName: `${currentUser.name || ""} ${currentUser.surname || ""}`.trim() || "თქვენ",
      authorRole: "მსმენელი",
      createdAt: new Date().toISOString(),
      message: trimmedMessage,
    };

    window.Auth?.updateCurrentUser?.({
      lessonComments: [...normalizeArray(currentUser.lessonComments), comment],
    });

    return comment;
  }

  function getLessonThread(course, lesson, user) {
    return [buildMentorComment(course, lesson), ...getStoredLessonComments(user, course.id, lesson.id)];
  }

  function getSubmissionDraft(state, courseId, lessonId, user) {
    const key = `${courseId}:${lessonId}`;

    if (!state.submissionDrafts[key]) {
      const savedSubmission = getLessonSubmission(user, courseId, lessonId);
      state.submissionDrafts[key] = savedSubmission
        ? {
            id: savedSubmission.id,
            text: savedSubmission.text,
            attachments: savedSubmission.attachments.map((attachment) => clone(attachment)),
            submittedAt: savedSubmission.submittedAt,
            updatedAt: savedSubmission.updatedAt,
          }
        : {
            id: "",
            text: "",
            attachments: [],
            submittedAt: "",
            updatedAt: "",
          };
    }

    return state.submissionDrafts[key];
  }

  function getCommentDraft(state, courseId, lessonId) {
    const key = `${courseId}:${lessonId}`;

    if (typeof state.commentDrafts[key] !== "string") {
      state.commentDrafts[key] = "";
    }

    return state.commentDrafts[key];
  }

  function purchaseCourse(course) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      return {
        ok: false,
        authRequired: true,
        message: "კურსის შესაძენად ჯერ შეხვედი ან დარეგისტრირდი.",
      };
    }

    if (hasCourseAccess(course, currentUser)) {
      return {
        ok: true,
        alreadyOwned: true,
        message: "კურსი უკვე აქტიურია შენს პროფილში.",
      };
    }

    ensureEnrollment(course, { purchased: true });

    const nextCourses = getCourses().map((item) =>
      Number(item.id) === Number(course.id)
        ? {
            ...item,
            sales: Number(item.sales || 0) + 1,
          }
        : item,
    );
    saveCourses(nextCourses);

    return {
      ok: true,
      message: "კურსი წარმატებით გააქტიურდა.",
    };
  }

  function getCourseCardIcon(course) {
    const category = String(course?.cat || "");
    const icons = {
      "არტთერაპია": `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3c5 0 9 3.8 9 8.2 0 3.7-3 6.4-6.2 6.4h-1.3c-.6 0-.9.7-.5 1.1.5.5.7 1.2.7 1.8 0 1.2-.9 2.1-2.2 2.1C7 22.6 3 18.4 3 12.9 3 7.4 7.1 3 12 3Z"></path>
          <circle cx="8" cy="11" r="1"></circle>
          <circle cx="11" cy="8" r="1"></circle>
          <circle cx="15" cy="9" r="1"></circle>
          <path d="M17.8 14.1c-.7 1.2-2 2-3.6 2h-1.4"></path>
        </svg>
      `,
      "მშობლებისთვის": `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="2.6"></circle>
          <circle cx="16" cy="7.4" r="2.2"></circle>
          <circle cx="12.4" cy="14.3" r="2.4"></circle>
          <path d="M4.5 18.5a3.8 3.8 0 0 1 7.1-1.8"></path>
          <path d="M13.7 17a3.4 3.4 0 0 1 5.8 1.5"></path>
          <path d="M8.4 20.2a4.4 4.4 0 0 1 8 0"></path>
        </svg>
      `,
      "კომუნიკაცია": `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 6.5c0-1.9 1.5-3.5 3.4-3.5h7.2c1.9 0 3.4 1.6 3.4 3.5v4.7c0 1.9-1.5 3.5-3.4 3.5H11l-3.7 3v-3H8.4C6.5 14.7 5 13.1 5 11.2Z"></path>
          <path d="M8.8 8.6h6.4"></path>
          <path d="M8.8 11.2h4.6"></path>
        </svg>
      `,
      "ფსიქოლოგია": `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9.2 4.5c-2.7.2-4.7 2.4-4.7 5 0 1.8.9 3.4 2.3 4.3.8.5 1.2 1.4 1.2 2.3v1.1"></path>
          <path d="M14.8 4.5c2.7.2 4.7 2.4 4.7 5 0 1.8-.9 3.4-2.3 4.3-.8.5-1.2 1.4-1.2 2.3v1.1"></path>
          <path d="M8 19h8"></path>
          <path d="M9.5 22h5"></path>
          <path d="M9 10.2c.9-.6 1.8-.9 3-.9 2.2 0 3.6 1.2 3.6 3 0 1.6-.9 2.4-2.3 3.2-.8.5-1.3 1.1-1.3 2"></path>
        </svg>
      `,
    };

    return icons[category] || icons["ფსიქოლოგია"];
  }

  function renderCatalogCard(course, user) {
    const enrollment = getEnrollment(user, course.id);
    const detailHref = `course-detail.html?id=${escapeHtml(course.id)}`;
    const statusClass = course.free ? "badge-free" : "badge-paid";
    const statusLabel = course.free ? "უფასო" : "ფასიანი";
    const actionLabel = enrollment ? "გაგრძელება" : "აღმოაჩინე";

    return `
      <a class="card course-catalog-card animate-on-scroll" href="${detailHref}" data-course-card-state="${course.free ? "free" : "paid"}" aria-label="${escapeHtml(course.title)}">
        <div class="course-catalog-card__header">
          <h3>${escapeHtml(course.title)}</h3>
          <span class="course-catalog-card__icon" aria-hidden="true">${getCourseCardIcon(course)}</span>
        </div>
        <div class="course-catalog-card__reveal">
          <div class="catalog-card__divider"></div>
          <p class="catalog-card__desc">${escapeHtml(course.desc)}</p>
          <div class="course-catalog-card__meta" aria-label="კურსის მოკლე მონაცემები">
            <span class="course-catalog-card__meta-item">${escapeHtml(course.lessons)} ლექცია</span>
            <span class="course-catalog-card__meta-item">${escapeHtml(course.hours)} საათი</span>
            <span class="course-catalog-card__meta-item">ონლაინ ფორმატი</span>
          </div>
          <span class="course-catalog-card__cta" aria-hidden="true">${actionLabel} ${renderArrowIcon("right")}</span>
        </div>
        <div class="course-catalog-card__media">
          <img class="optimized-media" src="${escapeHtml(course.image)}" alt="${escapeHtml(course.imageAlt || course.title)}" onerror="this.onerror=null;this.src='${IMAGE_FALLBACK_URL}';">
          <span class="course-catalog-card__status ${statusClass}">${statusLabel}</span>
          <span class="course-catalog-card__duration">ხანგრძლივობა • ${escapeHtml(course.hours)} საათი</span>
        </div>
      </a>
    `;
  }

  function initCoursesPage() {
    const page = document.querySelector("[data-courses-page]");

    if (!page) {
      return;
    }

    seedCourses();

    const filters = [...page.querySelectorAll("[data-course-filter]")];
    const searchInput = page.querySelector("[data-course-search]");
    const resultsCount = page.querySelector("[data-results-count]");
    const grid = page.querySelector("[data-courses-grid]");
    const emptyState = page.querySelector("[data-courses-empty]");
    const state = {
      filter: "all",
      query: "",
    };
    const params = new URLSearchParams(window.location.search);
    const categoryFilter = params.get("category");
    if (categoryFilter && ["free", "paid", ...FILTERABLE_CATEGORIES].includes(categoryFilter)) {
      state.filter = categoryFilter;
    }
    const queryFilter = params.get("q");
    if (queryFilter) {
      state.query = queryFilter;
      if (searchInput) {
        searchInput.value = queryFilter;
      }
    }

    const storedQuery = localStorage.getItem("courseSearchQuery");
    if (storedQuery) {
      state.query = storedQuery;
      if (searchInput) {
        searchInput.value = storedQuery;
      }
      localStorage.removeItem("courseSearchQuery");
    }

    function matches(course) {
      const query = state.query.trim().toLowerCase();
      const inSearch = !query || String(course.title || "").toLowerCase().includes(query);

      if (!inSearch) {
        return false;
      }

      if (state.filter === "all") {
        return true;
      }

      if (state.filter === "free") {
        return Boolean(course.free);
      }

      if (state.filter === "paid") {
        return !course.free;
      }

      return course.cat === state.filter;
    }

    function render() {
      const user = getCurrentUser();
      const filteredCourses = getCourses().filter(matches);

      if (resultsCount) {
        resultsCount.textContent = `${filteredCourses.length} კურსი`;
      }

      if (grid) {
        grid.innerHTML = filteredCourses.map((course) => renderCatalogCard(course, user)).join("");
      }

      if (emptyState) {
        emptyState.classList.toggle("hide", filteredCourses.length > 0);
      }

      filters.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.courseFilter === state.filter);
      });

      window.MakaUI?.initScrollAnimations?.();
    }

    filters.forEach((button) => {
      button.addEventListener("click", () => {
        state.filter = button.dataset.courseFilter || "all";
        render();
      });
    });

    searchInput?.addEventListener(
      "input",
      debounce(() => {
        state.query = searchInput.value || "";
        render();
      }),
    );

    document.addEventListener("courses:search", (event) => {
      state.query = String(event.detail?.query || "");
      if (searchInput) {
        searchInput.value = state.query;
      }
      render();
    });

    document.addEventListener("auth:changed", render);
    render();
  }

  function renderLessonHeader(course, lesson, lessonOrder, totalLessons, user, hasAccess) {
    const progress = getCourseProgress(course, user);
    const completedLessons = getCompletedLessonsCount(course, user);
    const completedTasks = getCompletedTaskCount(course, lesson.id, user);
    const totalTasks = normalizeArray(lesson.tasks).length;
    const isCompleted = getLessonCompletionState(getEnrollment(user, course.id), lesson.id);

    return `
      <section class="card lesson-overview lesson-overview--workspace">
        <div class="lesson-overview__top">
          <div class="breadcrumb breadcrumb--muted lesson-overview__breadcrumb">
            <a href="courses.html">კურსები</a>
            <span class="breadcrumb__slash" aria-hidden="true">/</span>
            <span>${escapeHtml(course.title)}</span>
            <span class="breadcrumb__slash" aria-hidden="true">/</span>
            <span>${escapeHtml(`გაკვეთილი ${lessonOrder}`)}</span>
          </div>
          <span class="lesson-overview__status${hasAccess ? "" : " is-locked"}">${hasAccess ? (isCompleted ? "დასრულებულია" : "აქტიური გაკვეთილი") : "ფასიანი გაკვეთილი"}</span>
        </div>

        <div class="lesson-overview__body">
          <div class="lesson-overview__content stack-sm">
            <div class="lesson-overview__eyebrow-row">
              <span class="lesson-overview__eyebrow">${escapeHtml(course.title)}</span>
              <span class="lesson-overview__divider" aria-hidden="true"></span>
              <span class="lesson-overview__eyebrow">${escapeHtml(`გაკვეთილი ${lessonOrder} / ${totalLessons}`)}</span>
              <span class="lesson-overview__divider" aria-hidden="true"></span>
              <span class="lesson-overview__eyebrow">${escapeHtml(lesson.duration)}</span>
            </div>
            <h2>${escapeHtml(getLessonShortTitle(course, lesson))}</h2>
            <p class="lesson-overview__lead">ჯერ უყურე ვიდეოს, შემდეგ შეასრულე ქვემოთ მოცემული ნაბიჯები და ბოლოს ერთიანად შეინახე შენი პასუხი, ფოტოები ან ფაილები.</p>
          </div>

          <div class="lesson-overview__aside">
            <div class="lesson-progress-card">
              <div class="lesson-progress-card__meta">
                <strong>${progress}% პროგრესი</strong>
                <span>${completedLessons}/${totalLessons} გაკვეთილი</span>
              </div>
              <div class="progress progress--soft"><span style="width: ${progress}%"></span></div>
              <div class="lesson-progress-card__footer">
                <span>${completedTasks}/${totalTasks} დავალება მონიშნულია</span>
                <span>${hasAccess ? (isCompleted ? "ნანახი" : "მიმდინარე") : "დაბლოკილი"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderLessonPlayer(course, lesson, hasAccess, isCompleted) {
    const videoPoster = lesson.poster || course.image;

    if (!hasAccess) {
      return `
        <section class="card lesson-player-card lesson-player-card--locked">
          <div class="lesson-section-heading">
            <div class="stack-sm">
              <span class="section-label" style="margin-bottom: 0;">ვიდეო</span>
              <h3>გაკვეთილის ვიდეო</h3>
            </div>
            <div class="lesson-section-heading__meta">
              <span class="lesson-chip">${escapeHtml(lesson.duration)}</span>
              <span class="lesson-chip lesson-chip--locked">ჩაკეტილი</span>
            </div>
          </div>

          <div class="lesson-player lesson-player--locked" style="background-image: linear-gradient(180deg, rgba(18,14,12,0.44), rgba(18,14,12,0.72)), url('${escapeHtml(
            videoPoster,
          )}')">
            <div class="lesson-lock-card">
              <div class="lesson-lock-card__icon" aria-hidden="true">◎</div>
              <h3>სრული გაკვეთილი გაიხსნება შეძენის შემდეგ</h3>
              <p>ვიდეო, პრაქტიკული დავალებები, ფაილების ატვირთვა და კომენტარების სივრცე ხელმისაწვდომი გახდება სრული წვდომის აქტივაციის შემდეგ.</p>
              <button class="btn btn-primary" type="button" data-course-purchase>კურსის გახსნა ${escapeHtml(
                toCurrency(course.price),
              )} ${renderArrowIcon("right", "btn-arrow")}</button>
            </div>
          </div>
        </section>
      `;
    }

    return `
      <section class="card lesson-player-card">
        <div class="lesson-section-heading">
          <div class="stack-sm">
            <span class="section-label" style="margin-bottom: 0;">ვიდეო</span>
            <h3>გაკვეთილის ვიდეო</h3>
          </div>
          <div class="lesson-section-heading__meta">
            <span class="lesson-chip">${escapeHtml(lesson.duration)}</span>
            <span class="lesson-chip${isCompleted ? " lesson-chip--complete" : ""}">${isCompleted ? "ნანახია" : "უყურე ბოლომდე"}</span>
          </div>
        </div>

        <div class="lesson-player-shell">
          <div class="lesson-player" data-player-shell>
            <video data-lesson-video controls playsinline preload="metadata" poster="${escapeHtml(videoPoster)}">
              <source src="${escapeHtml(lesson.videoUrl)}" type="video/mp4">
            </video>
            <button class="player-overlay" type="button" aria-label="ვიდეოს ჩართვა ან დაპაუზება" data-player-toggle>
              ▶
            </button>
          </div>
        </div>

        <div class="lesson-player__footer">
          <p>${escapeHtml(getLessonShortTitle(course, lesson))}-ის ნახვის შემდეგ შეგიძლია პირდაპირ გადახვიდე დავალებებზე და შემდეგ შენს პასუხზე.</p>
          <button class="btn ${isCompleted ? "btn-outline" : "btn-primary"} lesson-inline-action" type="button" data-lesson-complete>
            ${isCompleted ? "გაკვეთილი დასრულებულია" : "მონიშნე როგორც ნანახი"}
          </button>
        </div>
      </section>
    `;
  }

  function renderLessonIntro(course, lesson) {
    return `
      <section class="card lesson-description lesson-description--workspace">
        <div class="lesson-section-heading lesson-section-heading--compact">
          <div class="stack-sm">
            <span class="section-label" style="margin-bottom: 0;">შინაარსი</span>
            <h3>რას ეხება ეს გაკვეთილი</h3>
          </div>
        </div>

        <div class="lesson-description__content">
          <p>${escapeHtml(lesson.description)}</p>
          <p>ქვემოთ ნახავ ნაბიჯ-ნაბიჯ დავალებებს, რომ თეორია მშვიდად გადაიტანო პრაქტიკაში და შემდეგ ერთ სივრცეში შეინახო საკუთარი პასუხი.</p>
        </div>
      </section>
    `;
  }

  function renderTasks(course, lesson, user, state, hasAccess) {
    const tasks = normalizeArray(lesson.tasks);
    const completedTasks = tasks.filter((task, index) => getTaskChecked(user, course.id, lesson.id, index)).length;

    if (!hasAccess) {
      return `
        <section class="card lesson-tasks lesson-tasks--locked">
          <div class="lesson-section-heading">
            <div class="stack-sm">
              <span class="section-label" style="margin-bottom: 0;">დავალებები</span>
              <h3>პრაქტიკული ნაბიჯები</h3>
            </div>
            <div class="lesson-section-heading__meta">
              <span class="lesson-chip lesson-chip--locked">დაბლოკილი</span>
            </div>
          </div>
          <div class="lesson-empty-state">
            <strong>ეს ნაწილი კურსის შეძენის შემდეგ გაიხსნება.</strong>
            <p>სრული წვდომით ნახავ დავალებების განმარტებას, შენს პასუხის განყოფილებას და უკუკავშირის ნაკადს.</p>
          </div>
        </section>
      `;
    }

    return `
      <section class="card lesson-tasks">
        <div class="lesson-section-heading">
          <div class="stack-sm">
            <span class="section-label" style="margin-bottom: 0;">დავალებები</span>
            <h3>რა ნაბიჯები უნდა შეასრულო</h3>
          </div>
          <div class="lesson-section-heading__meta">
            <span class="lesson-chip">${completedTasks}/${tasks.length} შესრულებულია</span>
          </div>
        </div>

        <div class="lesson-tasks__intro">
          <p>გაიარე ეს ნაბიჯები შენი ტემპით. თითოეულ დავალებას შეგიძლია გაეცნო დეტალურად, მონიშნო შესრულება და შემდეგ ქვემოთ დაამატო ერთიანი პასუხი.</p>
          ${user ? "" : '<div class="catalog-note">მონიშვნის, პასუხის შენახვის და კომენტარების დასამატებლად გაიარე ავტორიზაცია.</div>'}
        </div>

        <ul class="task-list lesson-task-list">
          ${tasks
            .map((task, index) => {
              const checked = user ? getTaskChecked(user, course.id, lesson.id, index) : false;
              const isOpen = Number(state.openTaskIndex) === index;
              const taskBodyId = `lesson-task-panel-${escapeHtml(lesson.id)}-${index}`;

              return `
                <li class="task-item lesson-task${isOpen ? " is-open" : ""}${checked ? " is-complete" : ""}" data-task-state="${
                  checked ? "complete" : isOpen ? "active" : "idle"
                }">
                  <div class="lesson-task__header">
                    <button class="task-check lesson-task__check${checked ? " is-checked" : ""}" type="button" data-task-check="${index}" aria-label="${
                      checked ? "შესრულების მონიშვნის გაუქმება" : "დავალების შესრულებულად მონიშვნა"
                    }">
                      <span>${checked ? "✓" : ""}</span>
                    </button>

                    <button class="lesson-task__trigger" type="button" data-task-toggle="${index}" aria-expanded="${isOpen ? "true" : "false"}" aria-controls="${taskBodyId}">
                      <span class="lesson-task__summary">
                        <strong>${escapeHtml(task.title)}</strong>
                        <span>${escapeHtml(getTaskHelperText(index))}</span>
                      </span>

                      <span class="lesson-task__side">
                        <span class="lesson-task__status">${escapeHtml(getTaskStatusLabel(checked, isOpen))}</span>
                        <span class="lesson-task__toggle" aria-hidden="true">${isOpen ? "−" : "+"}</span>
                      </span>
                    </button>
                  </div>

                  <div class="task-item__body lesson-task__body" id="${taskBodyId}">
                    <p>${escapeHtml(task.details)}</p>

                    <div class="lesson-task__hint">
                      <strong>რჩევა</strong>
                      <span>როდესაც ამ ნაბიჯს დაასრულებ, ქვემოთ არსებულ განყოფილებაში შეგიძლია დაწერო მოკლე პასუხი და დაურთო ფოტო ან ფაილი.</span>
                    </div>

                    <div class="lesson-task__actions">
                      <button class="btn btn-outline lesson-inline-action" type="button" data-scroll-submission>შენი პასუხის განყოფილებაზე გადასვლა</button>
                    </div>
                  </div>
                </li>
              `;
            })
            .join("")}
        </ul>
      </section>
    `;
  }

  function renderSubmissionAttachments(attachments) {
    if (!attachments.length) {
      return `
        <div class="lesson-submission__empty">
          <strong>ჯერ ფაილი არ დაგიმატებია.</strong>
          <p>შეგიძლია ატვირთო ფოტო, PDF ან სხვა მოკლე ფაილი, რომელიც აჩვენებს როგორ შეასრულე დავალება.</p>
        </div>
      `;
    }

    return `
      <div class="lesson-attachment-grid">
        ${attachments
          .map((attachment) => {
            const fileSize = formatFileSize(attachment.size);

            return `
              <article class="lesson-attachment-card${attachment.isImage ? " is-image" : ""}">
                ${
                  attachment.isImage && attachment.dataUrl
                    ? `<img src="${attachment.dataUrl}" alt="${escapeHtml(attachment.name)}">`
                    : `<div class="lesson-attachment-card__icon" aria-hidden="true">${escapeHtml(
                        attachment.name.slice(0, 1).toUpperCase(),
                      )}</div>`
                }
                <div class="lesson-attachment-card__copy">
                  <strong>${escapeHtml(attachment.name)}</strong>
                  <span>${escapeHtml(fileSize || attachment.type || "ფაილი")}</span>
                </div>
                <button class="lesson-attachment-card__remove" type="button" data-draft-attachment-remove="${escapeHtml(
                  attachment.id,
                )}" aria-label="ფაილის წაშლა">
                  ×
                </button>
              </article>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderSubmissionSection(course, lesson, user, state, hasAccess) {
    const draft = getSubmissionDraft(state, course.id, lesson.id, user);

    if (!hasAccess) {
      return `
        <section class="card lesson-submission lesson-submission--locked" id="lesson-submission">
          <div class="lesson-section-heading">
            <div class="stack-sm">
              <span class="section-label" style="margin-bottom: 0;">შენი პასუხი</span>
              <h3>შესრულებული დავალების შენახვა</h3>
            </div>
          </div>
          <div class="lesson-empty-state">
            <strong>პასუხის გაგზავნა ამჟამად მიუწვდომელია.</strong>
            <p>ამ სივრცეში შეგეძლება ტექსტის დაწერა, ფოტოების ატვირთვა და საბოლოო პასუხის შენახვა მას შემდეგ, რაც კურსის სრული წვდომა გააქტიურდება.</p>
          </div>
        </section>
      `;
    }

    return `
      <section class="card lesson-submission" id="lesson-submission">
        <div class="lesson-section-heading">
          <div class="stack-sm">
            <span class="section-label" style="margin-bottom: 0;">შენი პასუხი</span>
            <h3>შენი შესრულებული დავალება</h3>
          </div>
          ${
            draft.submittedAt
              ? `<span class="lesson-submission__saved">ბოლო შენახვა ${escapeHtml(formatDateTime(draft.updatedAt || draft.submittedAt))}</span>`
              : ""
          }
        </div>

        <p class="lesson-submission__intro">აქ შეგიძლია ერთიანად აღწერო შენი გამოცდილება, ატვირთო ფოტოები ან ფაილები და მშვიდად შეინახო პასუხი მოგვიანებით გასაზიარებლად.</p>

        ${user ? "" : '<div class="catalog-note">პასუხის შესანახად გაიარე ავტორიზაცია.</div>'}

        <form class="lesson-submission__form" data-lesson-submission-form>
          <div class="lesson-field">
            <label class="field-label" for="lesson-submission-text-${escapeHtml(lesson.id)}">ტექსტური პასუხი</label>
            <textarea id="lesson-submission-text-${escapeHtml(
              lesson.id,
            )}" rows="7" data-submission-text placeholder="მოკლედ აღწერე როგორ შეასრულე დავალებები, რა შენიშნე და რა იყო შენთვის განსაკუთრებით მნიშვნელოვანი." ${
              user ? "" : "disabled"
            }>${escapeHtml(draft.text)}</textarea>
          </div>

          <div class="lesson-upload-panel">
            <div class="lesson-upload-panel__copy">
              <strong>ფოტოები და ფაილები</strong>
              <p>ატვირთე ნამუშევარი, ჩანაწერი, ფოტო ან სხვა მოკლე მასალა. რამდენიმე ფაილის დამატებაც შეგიძლია.</p>
            </div>

            <div class="lesson-upload-panel__actions">
              <button class="btn btn-outline lesson-inline-action" type="button" data-submission-pick ${user ? "" : "disabled"}>ფაილის დამატება</button>
              <span>JPG, PNG, PDF, DOCX</span>
            </div>

            <input class="hide" type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" data-submission-input ${user ? "" : "disabled"}>
          </div>

          <div class="lesson-submission__preview">
            ${renderSubmissionAttachments(draft.attachments)}
          </div>

          <div class="lesson-submission__footer">
            <p>${user ? "ჯერ გადაამოწმე ტექსტი და დამატებული მასალები, შემდეგ დააჭირე შენახვას." : "ავტორიზაციის შემდეგ აქვე გააქტიურდება შენახვა და ფაილების დამატება."}</p>
            <button class="btn btn-primary" type="submit" ${user ? "" : "disabled"}>პასუხის შენახვა</button>
          </div>
        </form>
      </section>
    `;
  }

  function renderFeedbackSection(course, lesson, user, state, hasAccess) {
    const thread = getLessonThread(course, lesson, user);
    const commentDraft = getCommentDraft(state, course.id, lesson.id);

    return `
      <section class="card lesson-feedback">
        <div class="lesson-section-heading">
          <div class="stack-sm">
            <span class="section-label" style="margin-bottom: 0;">უკუკავშირი</span>
            <h3>კომენტარები და კითხვა-პასუხი</h3>
          </div>
          <div class="lesson-section-heading__meta">
            <span class="lesson-chip lesson-chip--muted">დამატებითი კომენტარები</span>
          </div>
        </div>

        <p class="lesson-feedback__intro">ეს სივრცე განკუთვნილია დამატებითი კითხვისთვის, მოკლე პასუხებისთვის და მენტორთან უფრო მშვიდი შემდგომი კომუნიკაციისთვის. ძირითადი პასუხი კი ზემოთ ინახება.</p>

        <div class="lesson-feedback__thread">
          ${thread
            .map((entry) => {
              const meta = [entry.authorRole, formatDateTime(entry.createdAt)].filter(Boolean).join(" / ");
              const avatarLabel =
                entry.authorType === "mentor"
                  ? "მ"
                  : String(entry.authorName || "თქვენ")
                      .split(/\s+/)
                      .filter(Boolean)
                      .map((part) => part[0] || "")
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "თ";

              return `
                <article class="lesson-comment${entry.authorType === "mentor" ? " is-mentor" : " is-student"}">
                  <div class="lesson-comment__avatar" aria-hidden="true">${escapeHtml(avatarLabel)}</div>
                  <div class="lesson-comment__bubble">
                    <div class="lesson-comment__meta">
                      <strong>${escapeHtml(entry.authorName)}</strong>
                      <span>${escapeHtml(meta)}</span>
                    </div>
                    <p>${escapeHtml(entry.message)}</p>
                  </div>
                </article>
              `;
            })
            .join("")}
        </div>

        ${
          hasAccess
            ? `
              ${user ? "" : '<div class="catalog-note">კომენტარის დასაწერად გაიარე ავტორიზაცია.</div>'}
              <form class="lesson-feedback__form" data-lesson-comment-form>
                <div class="lesson-field">
                  <label class="field-label" for="lesson-comment-text-${escapeHtml(lesson.id)}">მოკლე პასუხი ან კითხვა</label>
                  <textarea id="lesson-comment-text-${escapeHtml(
                    lesson.id,
                  )}" rows="4" data-comment-text placeholder="თუ გინდა, აქ დაუსვი დამატებითი კითხვა ან დატოვე მოკლე კომენტარი." ${
                    user ? "" : "disabled"
                  }>${escapeHtml(commentDraft)}</textarea>
                </div>

                <div class="lesson-feedback__form-footer">
                  <p>ეს ველი არის დამატებითი კომუნიკაციისთვის და არ ცვლის მთავარ დავალების პასუხს.</p>
                  <button class="btn btn-outline lesson-inline-action" type="submit" ${user ? "" : "disabled"}>კომენტარის დამატება</button>
                </div>
              </form>
            `
            : `
              <div class="lesson-empty-state lesson-empty-state--quiet">
                <strong>კომენტარების სივრცე გაიხსნება სრული წვდომის შემდეგ.</strong>
                <p>ვიდეოს, დავალებების და პასუხის განყოფილებასთან ერთად კომენტარების ნაკადიც სრულად გააქტიურდება.</p>
              </div>
            `
        }
      </section>
    `;
  }

  function renderSidebarCard(course, lesson, lessonOrder, user) {
    const enrollment = getEnrollment(user, course.id);
    const progress = getCourseProgress(course, user);
    const hasCourseFullAccess = hasCourseAccess(course, user);

    if (!course.free && !hasCourseFullAccess) {
      return `
        <section class="card purchase-card lesson-sidebar-card lesson-sidebar-card--purchase">
          <img class="optimized-media" src="${escapeHtml(course.image)}" alt="${escapeHtml(course.title)}" onerror="this.onerror=null;this.src='${IMAGE_FALLBACK_URL}';">
          <div class="stack-sm">
            <div class="cluster">
              <span class="badge badge-paid">სრული წვდომა</span>
              <span class="badge">${escapeHtml(course.cat)}</span>
            </div>
            <h3>${escapeHtml(course.title)}</h3>
            <p>ახლა უყურებ ${escapeHtml(`გაკვეთილს ${lessonOrder}`)}. სრული წვდომით გახსნილი იქნება ყველა გაკვეთილი, დავალებების სივრცე და უკუკავშირის განყოფილება.</p>
            <div class="purchase-card__price">
              <strong>${escapeHtml(toCurrency(course.price))}</strong>
            </div>
            <button class="btn btn-primary" type="button" data-course-purchase>შეიძინე კურსი ${renderArrowIcon("right", "btn-arrow")}</button>
          </div>
          <div class="lesson-sidebar-card__facts">
            <span>${escapeHtml(course.lessons)} გაკვეთილი</span>
            <span>${escapeHtml(course.hours)} საათი</span>
            <span>${escapeHtml(course.freeLessons)} უფასო გაკვეთილი</span>
          </div>
        </section>
      `;
    }

    return `
      <section class="card purchase-card purchase-card--active lesson-sidebar-card">
        <div class="cluster">
          <span class="badge ${course.free ? "badge-free" : "badge-paid"}">${course.free ? "უფასო კურსი" : "აქტიური წვდომა"}</span>
          <span class="badge">${escapeHtml(course.cat)}</span>
        </div>
        <h3>${escapeHtml(course.title)}</h3>
        <p>მიმდინარე გაკვეთილი: ${escapeHtml(`გაკვეთილი ${lessonOrder}`)}. გვერდი აგებულია ისე, რომ ვიდეო, დავალებები და პასუხის შენახვა იყოს ერთ წყობილ ნაკადად.</p>
        <div class="course-card__meta">
          <strong>${progress}% პროგრესი</strong>
          <span>${getCompletedLessonsCount(course, user)}/${flattenLessons(course).length} გაკვეთილი</span>
        </div>
        <div class="progress progress--soft"><span style="width: ${progress}%"></span></div>
        <div class="lesson-sidebar-card__facts">
          <span>${escapeHtml(lesson.duration)} ვიდეო</span>
          <span>${escapeHtml(normalizeArray(lesson.tasks).length)} დავალება</span>
          <span>${enrollment ? "პროფილში ინახება" : "წვდომა გააქტიურებულია"}</span>
        </div>
      </section>
    `;
  }

  function renderCourseContents(course, activeLessonId, openSectionId, user) {
    const lessonOrderMap = new Map(flattenLessons(course).map((lesson, index) => [lesson.id, index + 1]));

    return `
      <section class="card course-contents course-contents--workspace">
        <div class="space-between">
          <div class="stack-sm">
            <span class="section-label" style="margin-bottom: 0;">კურსის გზამკვლევი</span>
          </div>
          <span class="badge">${escapeHtml(course.lessons)} გაკვეთილი</span>
        </div>
        <div class="course-contents__list">
          ${normalizeArray(course.sections)
            .map((section) => {
              const isOpen = section.id === openSectionId;

              return `
                <article class="content-section${isOpen ? " is-open" : ""}">
                  <button class="content-section__toggle" type="button" data-section-toggle="${escapeHtml(section.id)}">
                    <div>
                      <strong>${escapeHtml(section.title)}</strong>
                      <span>${normalizeArray(section.lessons).length} გაკვეთილი</span>
                    </div>
                    <span>${isOpen ? "−" : "＋"}</span>
                  </button>
                  <div class="content-section__body">
                    <div class="content-section__inner">
                      ${normalizeArray(section.lessons)
                        .map((lesson) => {
                          const isActive = lesson.id === activeLessonId;
                          const locked = !hasLessonAccess(course, lesson.id, user);
                          const lessonOrder = lessonOrderMap.get(lesson.id) || 1;
                          const statusLabel = locked ? "ჩაკეტილი" : lesson.isFree && !course.free ? "უფასო" : "გახსნილი";

                          return `
                            <button class="lesson-row${isActive ? " is-active" : ""}${locked ? " is-locked" : ""}" type="button" data-lesson-target="${escapeHtml(
                              lesson.id,
                            )}">
                              <span class="lesson-row__title">
                                <strong>${escapeHtml(getLessonShortTitle(course, lesson))}</strong>
                                <span>${escapeHtml(`გაკვეთილი ${lessonOrder}`)} / ${escapeHtml(statusLabel)}</span>
                              </span>
                              <span class="lesson-row__meta">${escapeHtml(lesson.duration)}</span>
                            </button>
                          `;
                        })
                        .join("")}
                    </div>
                  </div>
                </article>
              `;
            })
            .join("")}
        </div>
      </section>
    `;
  }

  function renderCourseFacts(course, lesson) {
    return `
      <section class="card course-facts course-facts--workspace">
        <div class="stack-sm">
          <div class="space-between">
            <h3>კურსის ფორმატი</h3>
            <span class="badge">${escapeHtml(course.cat)}</span>
          </div>
          <div class="course-facts__grid">
            <div class="course-fact">
              <strong>${escapeHtml(course.lessons)}</strong>
              <span>გაკვეთილი</span>
            </div>
            <div class="course-fact">
              <strong>${escapeHtml(course.hours)}</strong>
              <span>საათი</span>
            </div>
            <div class="course-fact">
              <strong>${escapeHtml(lesson.duration)}</strong>
              <span>მიმდინარე ვიდეო</span>
            </div>
            <div class="course-fact">
              <strong>${escapeHtml(course.free ? "უფასო" : toCurrency(course.price))}</strong>
              <span>${course.free ? "წვდომა" : "ფასი"}</span>
            </div>
          </div>
          <p class="muted">${escapeHtml(course.fullDescription)}</p>
        </div>
      </section>
    `;
  }

  function renderLessonNavigation(course, previousLesson, nextLesson) {
    return `
      <nav class="course-nav lesson-navigation" aria-label="გაკვეთილებს შორის ნავიგაცია">
        <button class="lesson-navigation__button lesson-navigation__button--prev" type="button" data-lesson-nav="prev" ${previousLesson ? "" : "disabled"}>
          <span class="lesson-navigation__label">წინა გაკვეთილი</span>
          <strong>${previousLesson ? escapeHtml(getLessonShortTitle(course, previousLesson)) : "ეს პირველი გაკვეთილია"}</strong>
        </button>
        <button class="lesson-navigation__button lesson-navigation__button--next" type="button" data-lesson-nav="next" ${nextLesson ? "" : "disabled"}>
          <span class="lesson-navigation__label">შემდეგი გაკვეთილი</span>
          <strong>${nextLesson ? escapeHtml(getLessonShortTitle(course, nextLesson)) : "ეს ბოლო გაკვეთილია"}</strong>
        </button>
      </nav>
    `;
  }

  function renderCourseDetailLayout(course, user, state) {
    const flatLessons = flattenLessons(course);
    const activeIndex = Math.max(0, flatLessons.findIndex((lesson) => lesson.id === state.activeLessonId));
    const activeLesson = flatLessons[activeIndex] || flatLessons[0];
    const previousLesson = flatLessons[activeIndex - 1] || null;
    const nextLesson = flatLessons[activeIndex + 1] || null;
    const hasAccess = hasLessonAccess(course, activeLesson.id, user);
    const isCompleted = getLessonCompletionState(getEnrollment(user, course.id), activeLesson.id);
    const lessonOrder = activeIndex + 1;

    getSubmissionDraft(state, course.id, activeLesson.id, user);
    getCommentDraft(state, course.id, activeLesson.id);

    return `
      <div class="course-detail-layout__main">
        <div class="stack lesson-workspace">
          ${renderLessonHeader(course, activeLesson, lessonOrder, flatLessons.length, user, hasAccess)}
          ${renderLessonPlayer(course, activeLesson, hasAccess, isCompleted)}
          ${renderLessonIntro(course, activeLesson)}
          ${renderTasks(course, activeLesson, user, state, hasAccess)}
          ${renderSubmissionSection(course, activeLesson, user, state, hasAccess)}
          ${renderFeedbackSection(course, activeLesson, user, state, hasAccess)}
          ${renderLessonNavigation(course, previousLesson, nextLesson)}
        </div>
      </div>

      <aside class="course-detail-layout__sidebar">
        <div class="stack lesson-sidebar">
          ${renderSidebarCard(course, activeLesson, lessonOrder, user)}
          ${renderCourseContents(course, activeLesson.id, state.openSectionId, user)}
          <section class="card instructor-card instructor-card--workspace">
            <div class="instructor-card__profile">
              <span class="instructor-card__mark" aria-hidden="true">◎</span>
              <div class="stack-sm">
                <h3>მაკა გორდელაძე</h3>
                <p class="muted">ფსიქოლოგი | პედაგოგი</p>
                <p>თერაპიისა და საგანმანათლებლო პროგრამების ავტორი, რომელიც თეორიულ ცოდნას ყოველდღიურ პრაქტიკად გარდაქმნის მშვიდ და გასაგებ ნაბიჯებად.</p>
              </div>
            </div>
          </section>
          ${renderCourseFacts(course, activeLesson)}
        </div>
      </aside>
    `;
  }

  function bindPlayerControls(page, course, lessonId, rerender) {
    const video = page.querySelector("[data-lesson-video]");
    const overlayButton = page.querySelector("[data-player-toggle]");

    if (!(video instanceof HTMLVideoElement) || !(overlayButton instanceof HTMLButtonElement)) {
      return;
    }

    function syncOverlay() {
      overlayButton.classList.toggle("is-hidden", !video.paused);
      overlayButton.textContent = video.paused ? "▶" : "⏸";
    }

    overlayButton.addEventListener("click", async () => {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
      syncOverlay();
    });

    video.addEventListener("play", syncOverlay);
    video.addEventListener("pause", syncOverlay);
    video.addEventListener("ended", () => {
      markLessonCompleted(course, lessonId);
      syncOverlay();
      rerender();
    });

    syncOverlay();
  }

  function initCourseDetailPage() {
    const page = document.querySelector("[data-course-detail-page]");

    if (!page) {
      return;
    }

    seedCourses();

    const hero = page.querySelector("[data-course-hero]");
    const heroTitle = page.querySelector("[data-course-hero-title]");
    const heroBreadcrumbTrail = page.querySelector(".breadcrumb--hero-course");
    const layout = page.querySelector("[data-course-detail-layout]");
    const purchaseModal = document.getElementById("course-purchase-modal");
    const purchaseForm = purchaseModal?.querySelector("[data-course-payment-form]");
    const purchaseStatus = purchaseModal?.querySelector("[data-course-payment-status]");
    const purchaseEntry = purchaseModal?.querySelector("[data-course-payment-entry]");
    const purchaseConfirmation = purchaseModal?.querySelector("[data-course-payment-confirmation]");
    const purchaseConfirmButton = purchaseModal?.querySelector("[data-course-payment-confirm-button]");
    const purchaseFooter = purchaseModal?.querySelector(".modal__footer");
    const purchaseName = purchaseModal?.querySelector("#course-payment-name");
    const purchaseSurname = purchaseModal?.querySelector("#course-payment-surname");
    const purchaseNumber = purchaseModal?.querySelector("#course-payment-number");
    const purchaseExpiry = purchaseModal?.querySelector("#course-payment-expiry");
    const purchaseCvv = purchaseModal?.querySelector("#course-payment-cvv");
    const purchaseTitleNodes = purchaseModal ? [...purchaseModal.querySelectorAll("[data-course-payment-title]")] : [];
    const purchasePriceNodes = purchaseModal ? [...purchaseModal.querySelectorAll("[data-course-payment-price]")] : [];
    const purchaseSuccessTitle = purchaseModal?.querySelector("[data-course-payment-success-title]");
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id") || "1";
    const course = getCourseById(courseId);

    if (!course || !layout) {
      if (layout) {
        layout.innerHTML = '<div class="empty-state">კურსი ვერ მოიძებნა. დაბრუნდი <a href="courses.html">კურსების გვერდზე</a>.</div>';
      }
      return;
    }

    const initialLessonId = params.get("lesson") || flattenLessons(course)[0]?.id;
    const initialLesson = findLesson(course, initialLessonId);
    const state = {
      courseId: course.id,
      activeLessonId: initialLessonId,
      openSectionId: initialLesson?.sectionId || course.sections[0]?.id || "",
      openTaskIndex: getPreferredOpenTaskIndex(course, initialLessonId, getCurrentUser()),
      activeCourse: course,
      submissionDrafts: {},
      commentDrafts: {},
    };

    function setHeroTitle(title) {
      if (!heroTitle) {
        return;
      }

      const normalizedTitle = String(title || "").trim();
      heroTitle.textContent = normalizedTitle === "კურსი მშობლებისთვის" ? "მშობლებისთვის" : normalizedTitle;
    }

    function setHero(currentCourse) {
      setHeroTitle(currentCourse.title);

      if (heroBreadcrumbTrail) {
        heroBreadcrumbTrail.innerHTML = `
          <a href="index.html">მთავარი</a>
          <span class="breadcrumb__slash" aria-hidden="true">/</span>
          <span data-course-hero-crumb aria-current="page">${escapeHtml(currentCourse.title)}</span>
        `;
      }

      if (hero) {
        hero.style.backgroundImage = `linear-gradient(180deg, rgba(18,14,12,0.48), rgba(18,14,12,0.72)), url('${currentCourse.heroImage}')`;
      }
    }

    function updateQuery() {
      const nextParams = new URLSearchParams(window.location.search);
      nextParams.set("id", String(state.courseId));
      nextParams.set("lesson", state.activeLessonId);
      window.history.replaceState({}, "", `${window.location.pathname}?${nextParams.toString()}`);
    }

    function rerender() {
      const latestCourse = getCourseById(state.courseId) || state.activeCourse;
      state.activeCourse = latestCourse;

      if (latestCourse.free && getCurrentUser()) {
        ensureEnrollment(latestCourse);
      }

      setHero(latestCourse);
      layout.innerHTML = renderCourseDetailLayout(latestCourse, getCurrentUser(), state);
      updateQuery();
      bindDynamicEvents();
      bindPlayerControls(page, latestCourse, state.activeLessonId, rerender);
      window.MakaUI?.initScrollAnimations?.();
    }

    function openPurchaseModal() {
      const currentUser = getCurrentUser();

      if (!currentUser) {
        window.MakaUI?.showToast?.("კურსის შესაძენად საჭიროა ავტორიზაცია.", "info");
        window.setTimeout(() => {
          window.location.href = window.Auth?.resolvePath?.("login.html") || "login.html";
        }, 300);
        return;
      }

      purchaseTitleNodes.forEach((node) => {
        node.textContent = state.activeCourse.title;
      });

      purchasePriceNodes.forEach((node) => {
        node.textContent = toCurrency(state.activeCourse.price);
      });

      if (purchaseSuccessTitle) {
        purchaseSuccessTitle.textContent = state.activeCourse.title;
      }

      if (purchaseName instanceof HTMLInputElement) {
        purchaseName.value = currentUser.name || "";
      }

      if (purchaseSurname instanceof HTMLInputElement) {
        purchaseSurname.value = currentUser.surname || "";
      }

      if (purchaseNumber instanceof HTMLInputElement) {
        purchaseNumber.value = "";
      }

      if (purchaseExpiry instanceof HTMLInputElement) {
        purchaseExpiry.value = "";
      }

      if (purchaseCvv instanceof HTMLInputElement) {
        purchaseCvv.value = "";
      }

      if (purchaseStatus) {
        purchaseStatus.textContent = "";
        purchaseStatus.className = "payment-status";
      }

      purchaseEntry?.classList.remove("hide");
      purchaseConfirmation?.classList.add("hide");
      purchaseFooter?.classList.remove("hide");
      window.MakaUI?.openModal?.("course-purchase-modal");
    }

    function readFileAsBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("ფაილის წაკითხვა ვერ მოხერხდა."));
        reader.readAsDataURL(file);
      });
    }

    function bindDynamicEvents() {
      const currentCourse = state.activeCourse;
      const currentUser = getCurrentUser();
      const lessons = flattenLessons(currentCourse);
      const draftKey = `${currentCourse.id}:${state.activeLessonId}`;

      layout.querySelectorAll("[data-section-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
          const nextSectionId = button.dataset.sectionToggle || "";
          state.openSectionId = state.openSectionId === nextSectionId ? "" : nextSectionId;
          rerender();
        });
      });

      layout.querySelectorAll("[data-lesson-target]").forEach((button) => {
        button.addEventListener("click", () => {
          const lessonId = button.dataset.lessonTarget || "";
          const lesson = findLesson(currentCourse, lessonId);
          if (!lesson) {
            return;
          }

          state.activeLessonId = lessonId;
          state.openSectionId = lesson.sectionId;
          state.openTaskIndex = getPreferredOpenTaskIndex(currentCourse, lessonId, getCurrentUser());

          if (currentCourse.free && currentUser) {
            ensureEnrollment(currentCourse);
          }

          rerender();
        });
      });

      layout.querySelectorAll("[data-course-purchase]").forEach((button) => {
        button.addEventListener("click", openPurchaseModal);
      });

      layout.querySelectorAll("[data-lesson-nav]").forEach((button) => {
        button.addEventListener("click", () => {
          const currentIndex = lessons.findIndex((lesson) => lesson.id === state.activeLessonId);
          const targetLesson = button.dataset.lessonNav === "prev" ? lessons[currentIndex - 1] : lessons[currentIndex + 1];

          if (!targetLesson) {
            return;
          }

          state.activeLessonId = targetLesson.id;
          state.openSectionId = targetLesson.sectionId;
          state.openTaskIndex = getPreferredOpenTaskIndex(currentCourse, targetLesson.id, getCurrentUser());
          rerender();
        });
      });

      layout.querySelectorAll("[data-lesson-complete]").forEach((button) => {
        button.addEventListener("click", () => {
          if (!currentUser) {
            window.MakaUI?.showToast?.("გაკვეთილის მონიშვნისთვის გაიარე ავტორიზაცია.", "info");
            return;
          }

          markLessonCompleted(currentCourse, state.activeLessonId);
          window.MakaUI?.showToast?.("გაკვეთილი მონიშნულია როგორც ნანახი.", "success");
          rerender();
        });
      });

      layout.querySelectorAll("[data-task-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.taskToggle);
          state.openTaskIndex = state.openTaskIndex === index ? -1 : index;
          rerender();
        });
      });

      layout.querySelectorAll("[data-task-check]").forEach((button) => {
        button.addEventListener("click", () => {
          if (!currentUser) {
            window.MakaUI?.showToast?.("დავალებების შესანახად გაიარე ავტორიზაცია.", "info");
            return;
          }

          const index = Number(button.dataset.taskCheck);
          const checked = !getTaskChecked(currentUser, currentCourse.id, state.activeLessonId, index);
          updateTaskState(currentCourse, state.activeLessonId, index, checked);
          rerender();
        });
      });

      layout.querySelectorAll("[data-scroll-submission]").forEach((button) => {
        button.addEventListener("click", () => {
          layout.querySelector("#lesson-submission")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });

      layout.querySelectorAll("[data-submission-text]").forEach((textarea) => {
        textarea.addEventListener("input", (event) => {
          const field = event.currentTarget;
          getSubmissionDraft(state, currentCourse.id, state.activeLessonId, currentUser).text = String(field.value || "");
        });
      });

      layout.querySelectorAll("[data-comment-text]").forEach((textarea) => {
        textarea.addEventListener("input", (event) => {
          const field = event.currentTarget;
          state.commentDrafts[draftKey] = String(field.value || "");
        });
      });

      layout.querySelectorAll("[data-submission-pick]").forEach((button) => {
        button.addEventListener("click", () => {
          if (!currentUser) {
            window.MakaUI?.showToast?.("ფაილების დასამატებლად გაიარე ავტორიზაცია.", "info");
            return;
          }

          layout.querySelector("[data-submission-input]")?.click();
        });
      });

      layout.querySelectorAll("[data-submission-input]").forEach((input) => {
        input.addEventListener("change", async (event) => {
          const fileInput = event.currentTarget;
          const selectedFiles = [...(fileInput.files || [])];

          if (!selectedFiles.length) {
            return;
          }

          if (!currentUser) {
            window.MakaUI?.showToast?.("ფაილების დასამატებლად გაიარე ავტორიზაცია.", "info");
            fileInput.value = "";
            return;
          }

          const draft = getSubmissionDraft(state, currentCourse.id, state.activeLessonId, currentUser);
          const availableSlots = Math.max(0, 6 - draft.attachments.length);

          if (!availableSlots) {
            window.MakaUI?.showToast?.("ერთ გაკვეთილზე მაქსიმუმ 6 ფაილის დამატებაა შესაძლებელი.", "info");
            fileInput.value = "";
            return;
          }

          const filesToRead = selectedFiles.slice(0, availableSlots);
          const nextAttachments = [];

          try {
            for (const file of filesToRead) {
              if (Number(file.size || 0) > 4 * 1024 * 1024) {
                window.MakaUI?.showToast?.(`"${file.name}" აღემატება 4 MB-ს და ვერ დაემატა.`, "info");
                continue;
              }

              const dataUrl = await readFileAsBase64(file);
              nextAttachments.push(createSubmissionAttachment(file, dataUrl));
            }
          } catch (error) {
            window.MakaUI?.showToast?.("ფაილის ატვირთვა ვერ მოხერხდა.", "error");
            fileInput.value = "";
            return;
          }

          if (nextAttachments.length) {
            draft.attachments = [...draft.attachments, ...nextAttachments];
            window.MakaUI?.showToast?.("ფაილები დაემატა პასუხს.", "success");
            rerender();
          }

          fileInput.value = "";
        });
      });

      layout.querySelectorAll("[data-draft-attachment-remove]").forEach((button) => {
        button.addEventListener("click", () => {
          const attachmentId = button.dataset.draftAttachmentRemove || "";
          const draft = getSubmissionDraft(state, currentCourse.id, state.activeLessonId, currentUser);
          draft.attachments = draft.attachments.filter((attachment) => attachment.id !== attachmentId);
          rerender();
        });
      });

      layout.querySelectorAll("[data-lesson-submission-form]").forEach((form) => {
        form.addEventListener("submit", (event) => {
          event.preventDefault();

          if (!currentUser) {
            window.MakaUI?.showToast?.("პასუხის შესანახად გაიარე ავტორიზაცია.", "info");
            return;
          }

          const draft = getSubmissionDraft(state, currentCourse.id, state.activeLessonId, currentUser);
          const text = String(draft.text || "").trim();

          if (!text && !draft.attachments.length) {
            window.MakaUI?.showToast?.("გთხოვ, დაამატე ტექსტური პასუხი ან მინიმუმ ერთი ფაილი.", "info");
            return;
          }

          const savedSubmission = saveLessonSubmission(currentCourse.id, state.activeLessonId, {
            id: draft.id,
            text,
            attachments: draft.attachments,
            submittedAt: draft.submittedAt,
          });

          if (!savedSubmission) {
            window.MakaUI?.showToast?.("პასუხის შენახვა ვერ მოხერხდა.", "error");
            return;
          }

          state.submissionDrafts[draftKey] = {
            id: savedSubmission.id,
            text: savedSubmission.text,
            attachments: savedSubmission.attachments.map((attachment) => clone(attachment)),
            submittedAt: savedSubmission.submittedAt,
            updatedAt: savedSubmission.updatedAt,
          };

          markLessonCompleted(currentCourse, state.activeLessonId);
          window.MakaUI?.showToast?.("პასუხი შენახულია.", "success");
          rerender();
        });
      });

      layout.querySelectorAll("[data-lesson-comment-form]").forEach((form) => {
        form.addEventListener("submit", (event) => {
          event.preventDefault();

          if (!currentUser) {
            window.MakaUI?.showToast?.("კომენტარის დასაწერად გაიარე ავტორიზაცია.", "info");
            return;
          }

          const message = String(state.commentDrafts[draftKey] || "").trim();

          if (!message) {
            window.MakaUI?.showToast?.("გთხოვ, კომენტარის ტექსტი შეავსო.", "info");
            return;
          }

          const comment = addLessonComment(currentCourse.id, state.activeLessonId, message);

          if (!comment) {
            window.MakaUI?.showToast?.("კომენტარის დამატება ვერ მოხერხდა.", "error");
            return;
          }

          state.commentDrafts[draftKey] = "";
          window.MakaUI?.showToast?.("კომენტარი დაემატა.", "success");
          rerender();
        });
      });
    }

    purchaseForm?.addEventListener("submit", (event) => {
      event.preventDefault();

      if (
        !(purchaseName instanceof HTMLInputElement) ||
        !(purchaseSurname instanceof HTMLInputElement) ||
        !(purchaseNumber instanceof HTMLInputElement) ||
        !(purchaseExpiry instanceof HTMLInputElement) ||
        !(purchaseCvv instanceof HTMLInputElement)
      ) {
        return;
      }

      const payload = {
        name: purchaseName.value.trim(),
        surname: purchaseSurname.value.trim(),
        number: purchaseNumber.value.replace(/\s+/g, ""),
        expiry: purchaseExpiry.value.trim(),
        cvv: purchaseCvv.value.trim(),
      };

      if (!payload.name || !payload.surname || payload.number.length < 16 || payload.expiry.length < 5 || payload.cvv.length < 3) {
        if (purchaseStatus) {
          purchaseStatus.textContent = "გთხოვ, სწორად შეავსო გადახდის ყველა ველი.";
          purchaseStatus.className = "payment-status is-error";
        }
        return;
      }

      const result = purchaseCourse(state.activeCourse);

      if (!result.ok) {
        if (purchaseStatus) {
          purchaseStatus.textContent = result.message;
          purchaseStatus.className = "payment-status is-error";
        }
        return;
      }

      if (purchaseStatus) {
        purchaseStatus.textContent = result.message;
        purchaseStatus.className = "payment-status is-success";
      }

      purchaseEntry?.classList.add("hide");
      purchaseConfirmation?.classList.remove("hide");
      purchaseFooter?.classList.add("hide");
      window.MakaUI?.showToast?.(result.alreadyOwned ? result.message : "კურსი აქტიურია შენს პროფილში.", "success");
      rerender();
    });

    purchaseNumber?.addEventListener("input", () => {
      if (!(purchaseNumber instanceof HTMLInputElement)) {
        return;
      }

      const digits = purchaseNumber.value.replace(/\D+/g, "").slice(0, 16);
      purchaseNumber.value = digits.replace(/(.{4})/g, "$1 ").trim();
    });

    purchaseExpiry?.addEventListener("input", () => {
      if (!(purchaseExpiry instanceof HTMLInputElement)) {
        return;
      }

      const digits = purchaseExpiry.value.replace(/\D+/g, "").slice(0, 4);
      if (digits.length < 3) {
        purchaseExpiry.value = digits;
        return;
      }
      purchaseExpiry.value = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    });

    purchaseCvv?.addEventListener("input", () => {
      if (!(purchaseCvv instanceof HTMLInputElement)) {
        return;
      }

      purchaseCvv.value = purchaseCvv.value.replace(/\D+/g, "").slice(0, 4);
    });

    purchaseConfirmButton?.addEventListener("click", () => {
      window.MakaUI?.closeModal?.("course-purchase-modal");
      purchaseFooter?.classList.remove("hide");
      rerender();
    });

    document.addEventListener("auth:changed", rerender);
    setHero(course);
    rerender();
  }

  function init() {
    seedCourses();
    initCoursesPage();
    initCourseDetailPage();
  }

  window.MakaCourses = {
    DEFAULT_COURSES,
    FILTERABLE_CATEGORIES,
    seedCourses,
    getCourses,
    getCourseById,
    getCourseProgress,
    purchaseCourse,
  };

  onReady(init);
})();
