(() => {
  const COURSE_STORAGE_KEY = window.Auth?.STORAGE_KEYS?.courses || "courses";
  const DEFAULT_VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
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
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80&fit=crop",
      imageFallback: "https://picsum.photos/seed/arttherapy/400/225",
      imageAlt: "არტთერაპიისთვის განკუთვნილი ფერადი შემოქმედებითი მასალები",
      heroImage: "https://picsum.photos/seed/art-hero/1600/720",
      rating: 4.9,
      reviewCount: 24,
      students: 182,
      sales: 182,
    },
    {
      id: 2,
      title: "მშობლების კურსი",
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
      image: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=800&q=80&fit=crop",
      imageFallback: "https://picsum.photos/seed/parentscourse/400/225",
      imageAlt: "მშობელი და ბავშვი ყურადღებიანი კომუნიკაციის პროცესში",
      heroImage: "https://picsum.photos/seed/parent-hero/1600/720",
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
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800&q=80&fit=crop",
      imageFallback: "https://picsum.photos/seed/interpersonal/400/225",
      imageAlt: "ორი ადამიანი დიალოგისა და ურთიერთკავშირის პროცესში",
      heroImage: "https://picsum.photos/seed/comm-hero/1600/720",
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
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&fit=crop",
      imageFallback: "https://picsum.photos/seed/psychbasics/400/225",
      imageAlt: "ფსიქოლოგიის საფუძვლების სასწავლო და დაკვირვების კონტექსტი",
      heroImage: "https://picsum.photos/seed/psych-hero/1600/720",
      rating: 4.9,
      reviewCount: 42,
      students: 244,
      sales: 244,
    },
    {
      id: 5,
      title: "ემოციური წიგნიერება",
      cat: "ფსიქოლოგია",
      free: false,
      lessons: 14,
      hours: 11,
      desc: "ემოციების ამოცნობა, დასახელება და რეგულაცია",
      fullDescription:
        "ეს კურსი აგეხმარება უკეთ დაინახო საკუთარი ემოციური პატერნები, გაარჩიო ტრიგერები და შექმნა უფრო მდგრადი თვითრეგულაციის ყოველდღიური ჩარჩო.",
      freeLessons: 3,
      price: 110,
      originalPrice: 150,
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80&fit=crop",
      imageFallback: "https://picsum.photos/seed/emotionalhygiene/400/225",
      imageAlt: "ემოციური თვითრეფლექსიის მშვიდი და გააზრებული მომენტი",
      heroImage: "https://picsum.photos/seed/emotion-hero/1600/720",
      rating: 4.8,
      reviewCount: 27,
      students: 139,
      sales: 88,
    },
    {
      id: 6,
      title: "ოჯახური კომუნიკაცია",
      cat: "მშობლებისთვის",
      free: false,
      lessons: 11,
      hours: 8,
      desc: "ოჯახში კონფლიქტის შემცირება და თანამშრომლობის გაძლიერება",
      fullDescription:
        "ოჯახური დიალოგის, შეთანხმებებისა და ემპათიური კონტაქტის პრაქტიკული მოდელი, რომელიც გაჩვენებს როგორ იქმნება უსაფრთხო და სანდო გარემო სახლში.",
      freeLessons: 2,
      price: 95,
      originalPrice: 0,
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191011?w=800&q=80&fit=crop",
      imageFallback: "https://picsum.photos/seed/familycommunication/400/225",
      imageAlt: "ოჯახის წევრებს შორის თბილი საუბარი და ურთიერთგაგება",
      heroImage: "https://picsum.photos/seed/family-hero/1600/720",
      rating: 4.7,
      reviewCount: 14,
      students: 96,
      sales: 61,
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
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80&fit=crop",
      imageFallback: "https://picsum.photos/seed/creativeexpression/400/225",
      imageAlt: "შემოქმედებითი თვითგამოხატვისთვის განკუთვნილი ფერადი სამუშაო სივრცე",
      heroImage: "https://picsum.photos/seed/creative-hero/1600/720",
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
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80&fit=crop",
      imageFallback: "https://picsum.photos/seed/stresscourse/400/225",
      imageAlt: "სიმშვიდისა და სტრესთან გამკლავების პრაქტიკის ამსახველი გარემო",
      heroImage: "https://picsum.photos/seed/stress-hero/1600/720",
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

  const DEFAULT_COURSES = BASE_COURSES.map(buildCourse);
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

  function seedCourses() {
    const existing = readStorageValue(COURSE_STORAGE_KEY, []);

    if (!Array.isArray(existing) || !existing.length) {
      writeStorageValue(COURSE_STORAGE_KEY, DEFAULT_COURSES);
      return clone(DEFAULT_COURSES);
    }

    const normalized = existing.map((course) => syncCourseMedia(course?.sections ? course : buildCourse(course)));
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

  function renderCatalogCard(course, user) {
    const enrollment = getEnrollment(user, course.id);
    const progress = getCourseProgress(course, user);
    const completedLessons = getCompletedLessonsCount(course, user);
    const totalLessons = flattenLessons(course).length;
    const pricingMarkup = enrollment
      ? `
        <div class="catalog-card__progress">
          <div class="course-card__meta">
            <strong>${progress}% პროგრესი</strong>
            <span>${completedLessons}/${totalLessons} გაკვეთილი</span>
          </div>
          <div class="progress"><span style="width: ${progress}%"></span></div>
        </div>
      `
      : `
        <div class="catalog-card__price-row">
          <div class="price-stack">
            <strong class="price-tag">${escapeHtml(toCurrency(course.price))}</strong>
            ${
              Number(course.originalPrice) > Number(course.price) && Number(course.price) > 0
                ? `<span class="price-strike">₾${escapeHtml(course.originalPrice)}</span>`
                : ""
            }
          </div>
          <span class="muted">${course.free ? "ყველა გაკვეთილი ღიაა" : `${course.freeLessons} უფასო გაკვეთილი`}</span>
        </div>
      `;

    return `
      <article class="card course-catalog-card animate-on-scroll">
        <div class="course-catalog-card__media">
          <img src="${escapeHtml(course.image)}" alt="${escapeHtml(course.title)}" ${
            course.imageFallback ? `onerror="this.onerror=null;this.src='${escapeHtml(course.imageFallback)}';"` : ""
          }>
          <div class="course-catalog-card__badges">
            <span class="badge">${escapeHtml(course.cat)}</span>
            <span class="badge ${course.free ? "badge-free" : "badge-paid"}">${course.free ? "უფასო" : "ფასიანი"}</span>
          </div>
        </div>
        <div class="course-catalog-card__body">
          <div class="stack-sm">
            <h3>${escapeHtml(course.title)}</h3>
            <p class="muted">ინსტრუქტორი: მაკა გორდელაძე</p>
            <p class="catalog-card__desc">${escapeHtml(course.desc)}</p>
          </div>
          <div class="catalog-card__stats">
            <span>⏱ ${escapeHtml(course.hours)} საათი</span>
            <span>📚 ${escapeHtml(course.lessons)} ლექცია</span>
            <span>⭐ ${escapeHtml(course.rating)}</span>
          </div>
          <div class="catalog-card__divider"></div>
          ${pricingMarkup}
          <div class="course-card__footer">
            <a class="link-arrow" href="course-detail.html?id=${escapeHtml(course.id)}">კურსი →</a>
          </div>
        </div>
      </article>
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

  function renderLessonPlayer(course, lesson, hasAccess) {
    if (!hasAccess) {
      return `
        <section class="card lesson-player-card">
          <div class="lesson-player lesson-player--locked" style="background-image: linear-gradient(180deg, rgba(18,14,12,0.44), rgba(18,14,12,0.72)), url('${escapeHtml(
            course.image,
          )}')">
            <div class="lesson-lock-card">
              <div class="lesson-lock-card__icon">🔒</div>
              <h3>ეს გაკვეთილი ფასიანია</h3>
              <p>კურსის სრული შინაარსი, პრაქტიკული დავალებები და ფაილების ატვირთვა გაიხსნება შეძენის შემდეგ.</p>
              <button class="btn btn-primary" type="button" data-course-purchase>კურსის შეძენა ${escapeHtml(
                toCurrency(course.price),
              )} <span class="btn-arrow">→</span></button>
            </div>
          </div>
        </section>
      `;
    }

    return `
      <section class="card lesson-player-card">
        <div class="lesson-player" data-player-shell>
          <video data-lesson-video controls playsinline preload="metadata" poster="${escapeHtml(course.image)}">
            <source src="${escapeHtml(lesson.videoUrl)}" type="video/mp4">
          </video>
          <button class="player-overlay" type="button" aria-label="ვიდეოს ჩართვა ან დაპაუზება" data-player-toggle>
            ▶
          </button>
        </div>
      </section>
    `;
  }

  function renderTasks(course, lesson, user, state, hasAccess) {
    if (!hasAccess) {
      return `
        <section class="card lesson-tasks">
          <div class="stack-sm">
            <h3>📋 დავალებები</h3>
            <div class="empty-state">ეს დავალებები გაიხსნება კურსის შეძენის შემდეგ.</div>
          </div>
        </section>
      `;
    }

    const tasks = normalizeArray(lesson.tasks);

    return `
      <section class="card lesson-tasks">
        <div class="stack">
          <div class="stack-sm">
            <h3>📋 დავალებები</h3>
            <p class="muted">გამოიყენე ეს სავარჯიშოები ყოველდღიურ ცხოვრებაში.</p>
            ${
              user
                ? ""
                : '<div class="catalog-note">დავალებების მონიშვნისა და ფაილების შენახვისთვის გაიარე ავტორიზაცია.</div>'
            }
          </div>
          <ul class="task-list">
            ${tasks
              .map((task, index) => {
                const checked = user ? getTaskChecked(user, course.id, lesson.id, index) : false;
                const upload = user ? getTaskUpload(user, course.id, lesson.id, index) : null;
                const isOpen = Number(state.openTaskIndex) === index;

                return `
                  <li class="task-item${isOpen ? " is-open" : ""}">
                    <div class="task-item__header">
                      <button class="task-check${checked ? " is-checked" : ""}" type="button" data-task-check="${index}">
                        <span>${checked ? "✓" : ""}</span>
                      </button>
                      <div class="task-item__summary">
                        <strong>${escapeHtml(task.title)}</strong>
                        <span class="help-text">${checked ? "დასრულებულია" : "მონიშნე შესრულების შემდეგ"}</span>
                      </div>
                      <button class="task-toggle" type="button" data-task-toggle="${index}">
                        ${isOpen ? "−" : "+"}
                      </button>
                    </div>
                    <div class="task-item__body">
                      <p>${escapeHtml(task.details)}</p>
                      <div class="task-item__actions">
                        <button class="task-upload-btn" type="button" data-task-upload="${index}" ${user ? "" : "disabled"}>
                          ფოტოს ატვირთვა
                        </button>
                        <input class="hide" type="file" accept="image/*" data-task-input="${index}">
                      </div>
                      ${
                        upload?.imageBase64
                          ? `<img class="task-upload-preview" src="${upload.imageBase64}" alt="${escapeHtml(task.title)}">`
                          : ""
                      }
                    </div>
                  </li>
                `;
              })
              .join("")}
          </ul>
        </div>
      </section>
    `;
  }

  function renderSidebarCard(course, user) {
    const enrollment = getEnrollment(user, course.id);
    const progress = getCourseProgress(course, user);

    if (!course.free && !enrollment) {
      return `
        <section class="card purchase-card">
          <img src="${escapeHtml(course.image)}" alt="${escapeHtml(course.title)}">
          <div class="stack-sm">
            <div class="cluster">
              <span class="badge badge-paid">30% ფასდაკლება</span>
              <span class="badge">${escapeHtml(course.cat)}</span>
            </div>
            <div class="purchase-card__price">
              <strong>${escapeHtml(toCurrency(course.price))}</strong>
              ${Number(course.originalPrice) > Number(course.price) ? `<span class="price-strike">₾${escapeHtml(course.originalPrice)}</span>` : ""}
            </div>
            <button class="btn btn-primary" type="button" data-course-purchase>შეიძინე კურსი <span class="btn-arrow">→</span></button>
          </div>
          <ul class="check-list">
            <li>სრული წვდომა</li>
            <li>სერტიფიკატი</li>
            <li>უვადო წვდომა</li>
          </ul>
        </section>
      `;
    }

    return `
      <section class="card purchase-card purchase-card--active">
        <div class="cluster">
          <span class="badge ${course.free ? "badge-free" : "badge-paid"}">${course.free ? "უფასო კურსი" : "აქტიური წვდომა"}</span>
          <span class="badge">${escapeHtml(course.cat)}</span>
        </div>
        <h3>${escapeHtml(course.title)}</h3>
        <p>${course.free ? "კურსი სრულად ხელმისაწვდომია." : "შეძენა წარმატებით დასრულებულია და სრული შინაარსი გახსნილია."}</p>
        <div class="course-card__meta">
          <strong>${progress}% პროგრესი</strong>
          <span>${getCompletedLessonsCount(course, user)}/${flattenLessons(course).length} გაკვეთილი</span>
        </div>
        <div class="progress"><span style="width: ${progress}%"></span></div>
      </section>
    `;
  }

  function renderCourseContents(course, activeLessonId, openSectionId, user) {
    return `
      <section class="card course-contents">
        <div class="space-between">
          <h3>კურსის შინაარსი</h3>
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
                          return `
                            <button class="lesson-row${isActive ? " is-active" : ""}${locked ? " is-locked" : ""}" type="button" data-lesson-target="${escapeHtml(
                              lesson.id,
                            )}">
                              <span class="lesson-row__title">
                                ${locked ? "🔒" : lesson.isFree && !course.free ? "🆓" : "✅"} ${escapeHtml(lesson.title)}
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

  function renderReviewSnippet(course) {
    return `
      <section class="card course-reviews-snippet">
        <div class="stack-sm">
          <h3>⭐⭐⭐⭐⭐ ${escapeHtml(course.rating)} (${escapeHtml(course.reviewCount)} შეფასება)</h3>
          ${normalizeArray(course.reviews)
            .slice(0, 3)
            .map(
              (review) => `
                <article class="review-mini">
                  <strong>${escapeHtml(review.name)}</strong>
                  <span class="muted">${escapeHtml(review.role)} • ${"⭐".repeat(review.rating)}</span>
                  <p>${escapeHtml(review.comment)}</p>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderCourseDetailLayout(course, user, state) {
    const flatLessons = flattenLessons(course);
    const activeIndex = Math.max(0, flatLessons.findIndex((lesson) => lesson.id === state.activeLessonId));
    const activeLesson = flatLessons[activeIndex] || flatLessons[0];
    const previousLesson = flatLessons[activeIndex - 1] || null;
    const nextLesson = flatLessons[activeIndex + 1] || null;
    const hasAccess = hasLessonAccess(course, activeLesson.id, user);
    const progress = getCourseProgress(course, user);
    const lessonOrder = activeIndex + 1;

    return `
      <div class="course-detail-layout__main">
        <div class="stack">
          <section class="card lesson-overview">
            <div class="stack-sm">
              <div class="breadcrumb breadcrumb--muted">
                <a href="courses.html">კურსები</a>
                <span class="divider-dot" aria-hidden="true"></span>
                <span>${escapeHtml(course.title)}</span>
                <span class="divider-dot" aria-hidden="true"></span>
                <span>${escapeHtml(activeLesson.title)}</span>
              </div>
              <div class="lesson-overview__row">
                <div class="stack-sm">
                  <span class="badge">გაკვეთილი ${lessonOrder} / ${flatLessons.length}</span>
                  <h2>${escapeHtml(activeLesson.title)}</h2>
                </div>
                <div class="lesson-overview__progress">
                  <div class="course-card__meta">
                    <strong>${progress}% პროგრესი</strong>
                    <span>${getCompletedLessonsCount(course, user)} დასრულებული გაკვეთილი</span>
                  </div>
                  <div class="progress"><span style="width: ${progress}%"></span></div>
                </div>
              </div>
            </div>
          </section>

          ${renderLessonPlayer(course, activeLesson, hasAccess)}

          <section class="card lesson-description">
            <div class="stack-sm">
              <h3>${escapeHtml(activeLesson.title)}</h3>
              <p>${escapeHtml(activeLesson.description)}</p>
            </div>
          </section>

          ${renderTasks(course, activeLesson, user, state, hasAccess)}

          <div class="course-nav">
            <button class="btn btn-outline" type="button" data-lesson-nav="prev" ${previousLesson ? "" : "disabled"}>← წინა გაკვეთილი</button>
            <button class="btn btn-primary" type="button" data-lesson-nav="next" ${nextLesson ? "" : "disabled"}>შემდეგი გაკვეთილი →</button>
          </div>
        </div>
      </div>

      <aside class="course-detail-layout__sidebar">
        <div class="stack">
          ${renderSidebarCard(course, user)}
          ${renderCourseContents(course, activeLesson.id, state.openSectionId, user)}
          <section class="card instructor-card">
            <div class="instructor-card__profile">
              <img src="https://picsum.photos/seed/team1/200/200" alt="მაკა გორდელაძე">
              <div class="stack-sm">
                <h3>მაკა გორდელაძე</h3>
                <p class="muted">ფსიქოლოგი | პედაგოგი</p>
              </div>
            </div>
            <div class="cluster">
              <span>⭐ 4.9</span>
              <span>150+ სტუდენტი</span>
              <span>6 კურსი</span>
            </div>
          </section>
          ${renderReviewSnippet(course)}
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
    const heroBreadcrumb = page.querySelector("[data-course-hero-crumb]");
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

    const state = {
      courseId: course.id,
      activeLessonId: params.get("lesson") || flattenLessons(course)[0]?.id,
      openSectionId: course.sections[0]?.id || "",
      openTaskIndex: 0,
      activeCourse: course,
    };

    function setHero(currentCourse) {
      if (heroTitle) {
        heroTitle.textContent = currentCourse.title;
      }

      if (heroBreadcrumb) {
        heroBreadcrumb.textContent = currentCourse.title;
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
          state.openTaskIndex = 0;

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
          state.openTaskIndex = 0;
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

      layout.querySelectorAll("[data-task-upload]").forEach((button) => {
        button.addEventListener("click", () => {
          if (!currentUser) {
            window.MakaUI?.showToast?.("ფოტოს ასატვირთად საჭიროა ავტორიზაცია.", "info");
            return;
          }

          const index = button.dataset.taskUpload;
          layout.querySelector(`[data-task-input="${index}"]`)?.click();
        });
      });

      layout.querySelectorAll("[data-task-input]").forEach((input) => {
        input.addEventListener("change", async (event) => {
          const fileInput = event.currentTarget;
          const file = fileInput.files?.[0];

          if (!file) {
            return;
          }

          try {
            const imageBase64 = await readFileAsBase64(file);
            saveTaskUpload(currentCourse.id, state.activeLessonId, Number(fileInput.dataset.taskInput), imageBase64);
            window.MakaUI?.showToast?.("ფოტო შენახულია დავალებაში.", "success");
            rerender();
          } catch (error) {
            window.MakaUI?.showToast?.("ფაილის ატვირთვა ვერ მოხერხდა.", "error");
          }
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
