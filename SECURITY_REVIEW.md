# تقرير المراجعة الأمنية الأولية (Initial Security Review)

تمت مراجعة شيفرة المشروع قبل تطبيق التحسينات الأمنية، وتم رصد وتوثيق الثغرات التالية:

| # | اسم المشكلة | المكان (Endpoint / File) | مستوى الخطورة | الخطر المحتمل | المعالجة المقترحة |
|---|---|---|---|---|---|
| 1 | **تسريب تفاصيل التجزئة وكلمات المرور (Sensitive Data Exposure)** | `src/controllers/usersController.js` (في `getUsers`, `getUserById`, `createUser`) | **حرج (Critical)** | كشف حقل `hash_password` في استجابات JSON يعرض بيانات الاعتماد للاختراق في حال تسرب الردود. | تعديل استعلامات SQL لتحديد الحقول المطلوبة فقط واستثناء `hash_password` نهائياً. |
| 2 | **غياب المصادقة وإدارة الهوية (Missing Authentication Mechanism)** | `src/app.js` & `src/routes/` | **حرج (Critical)** | جميع المسارات الحساسة للمستخدمين والمنتجات والتصنيفات مفتوحة للعامة دون التحقق من هوية المرسل. | بناء مسارات تسجيل الدخول والتسجيل بالاعتماد على JWT و `bcrypt`. |
| 3 | **غياب نظام الصلاحيات والتفويض (Missing Role-Based Access Control)** | `src/routes/productsRoutes.js`, `categoriesRoutes.js`, `usersRoutes.js` | **عالي (High)** | تمكين أي زائر من إنشاء، تعديل، أو حذف وتعديل حالة المنتجات والتصنيفات والمستخدمين دون قيود الـ Admin. | إنشاء Middleware مخصص للتحقق من الأدوار وحظر غير المصرح لهم بإرجاع كود `403 Forbidden`. |
| 4 | **ثغرة الوصول المباشر غير الآمن للكائنات (IDOR Vulnerability)** | `GET /api/users/:id` و `PUT /api/users/:id` | **عالي (High)** | يستطيع المستخدم قراءة وتعديل بيانات مستخدمين آخرين بمجرد تغيير معرّف الـ ID في المسار. | التحقق من مطابقة `req.user.id` مع المعرف المطلوب أو امتلاك المستخدم لصلاحية الأدمن. |
| 5 | **غياب تقييد الطلبات وترويسات الحماية (Missing Rate Limiting & Security Headers)** | `src/app.js` | **متوسط (Medium)** | تعرض النظام لهجمات التخمين (Brute-Force) وهجمات الويب الشائعة (Clickjacking / MIME-sniffing). | تضمين مكتبة `helmet` وإضافة `express-rate-limit` وتطبيق قواعد صارمة على مسار الدخول. |