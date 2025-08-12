# 🧠 Accessibility & Disability Resources 总结

## 🎬 1. 《Crip Camp: A Disability Revolution》纪录片要点

- 讲述残障青少年在 1970 年代夏令营 **Camp Jened** 的经历。
- 他们从营地生活中体验到尊重和平等，并成长为推动美国残障权益运动的重要成员。
- 影片强调从自我认同出发，唤起行动意识，最终参与推动《康复法案》第 504 条落地。

## 🧾 2. 残障互动礼仪指南总结

### 🟩 2.1 Disability Belongs: Etiquette Toolkit
- **不要假设帮助别人是必要的**：先询问再行动。
- **直接与本人交流**：而不是他们的翻译、家属或陪同。
- **避免触碰辅助设备**：轮椅、导盲犬等是身体延伸。
- **尊重语言偏好**：使用 person-first 语言（如 "person with a disability"），除非对方明确表明别的偏好。
- **注意“激励式夸奖”陷阱**：不应将普通生活行动夸张称为“激励人心”。

### 🟦 2.2 Disability:IN - Disability Etiquette Guide
- 包括多种障碍类别下的沟通建议（视觉、听觉、语言、心理等）。
- 使用 **中性、事实导向的表达**：避免“suffers from”“victim of”等措辞。
- 强调通用沟通礼仪：耐心、灵活、使用辅助方式。
- 将无障碍纳入组织文化，鼓励包容型语言习惯在职场传播。

### 🟨 2.3 NCDJ Style Guide（国家残障新闻中心）
- 为媒体/写作者提供权威用词建议。
- 建议使用：
  - ✅ “person with a disability”
  - ✅ “person with autism”（也接受 identity-first，如 “autistic person”，视个人偏好）
- 避免：
  - ❌ “cripple”, “handicapped”, “victim of”, “suffers from”
- 特殊建议：
  - 精神健康应使用“experiencing depression”而不是“mentally ill”
  - 自杀应表述为“died by suicide”而非“committed suicide”

---

## 🖥 3. Digital.gov: An Advanced Approach to Accessibility

- 无障碍不仅是法律要求（Section 508 / WCAG），更是产品质量与社会责任的体现。
- 强调 **“Accessibility is a team responsibility”**。

### 🌱 五个建议实践方向：

| 编号 | 建议                                                  | 对 App/IoT 的含义                                                   |
|------|-------------------------------------------------------|---------------------------------------------------------------------|
| 1️⃣   | 阅读 WCAG 2.2 和 Section 508                         | 保证界面、按钮、颜色、结构等设计对所有用户可访问                         |
| 2️⃣   | 制定团队的 accessibility checklist                   | 每个阶段（设计、开发、测试）都检查是否考虑到无障碍                     |
| 3️⃣   | 使用 USWDS 等组件库                                  | 选择已设计好无障碍的按钮、表单、导航等 UI 元素                         |
| 4️⃣   | 安排残障用户参与测试                                  | 用屏幕阅读器、语音、键盘模拟等测试真实使用场景                         |
| 5️⃣   | 让无障碍成为团队文化而非事后补丁                     | 所有成员（产品经理/设计师/开发者）都要有无障碍意识并付诸实践           |

---

## 🧩 4. App / IoT 项目中无障碍设计建议

### ✅ 核心设计点
- 高对比配色、可放大的字体、按钮有清晰标签（aria-label）
- 语音辅助可读内容、图表有替代文字、导航支持键盘/语音
- 多通道反馈（视觉 + 声音 + 震动）适应听障/视障/行动障碍用户
- 使用已验证的设计系统（如 Material + a11y 插件 / USWDS）

### 📱 示例：做一个服药提醒 App
| 功能           | 无障碍优化                                       |
|----------------|--------------------------------------------------|
| 设置提醒       | 大字体、语音读出、键盘导航支持                   |
| 历史记录图表   | 附带文字摘要或语音解释                           |
| 手机通知       | 不只用颜色提示，配合声音或震动                   |
| IoT 智能灯控制 | 提供非视觉反馈（声音、闪烁、按钮反馈）           |

---

## 📌 建议下一步

- 可将这些原则写入团队 onboarding 手册 / 开发规范
- 在 Hackathon 项目中主动展示 accessibility 设计思路
- 若需 PPT / checklist 模板，请继续向我索取，我可为你定制

