# SkillBridge 🚀

**Live Demo:** [SkillBridge Live](https://skill-bridge-two-xi.vercel.app/)  
**GitHub Repository:** [SkillBridge Source](https://github.com/Aniket04-05/SkillBridge)

SkillBridge is an intelligent, AI-powered career progression and mentorship platform. It allows users to upload their resumes, parses their data, and generates a highly personalized, multi-day learning roadmap, customized interview questions, and ATS-friendly PDF resumes.

## 🌟 Key Features

* **AI Integration Engine (Google Gemini):** Utilizes structured prompts to parse resumes, identify exact skill gaps, and generate bespoke technical/behavioral questions and day-by-day learning roadmaps.
* **Server-Side PDF Generation:** Implements headless **Puppeteer** to render perfectly formatted, ATS-compliant PDF resumes directly from the Node.js backend.
* **Cross-Domain JWT Authentication:** Secure login architecture utilizing HTTP-only cookies (`sameSite: "none"`, `secure: true`) to seamlessly bridge the Vercel frontend and Render backend.
* **Custom Drag-and-Drop Uploads:** Native React dropzone integrated with HTML5 File APIs for seamless binary file processing and parsing.
* **Modern UI/UX:** Built with React and Tailwind CSS for a highly polished, responsive experience.

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **AI & Tools:** Google Gemini AI API, Puppeteer, JWT Auth

## 🚀 Quick Start

### Prerequisites
* Node.js (v18+)
* MongoDB URI
* Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/Aniket04-05/SkillBridge.git](https://github.com/Aniket04-05/SkillBridge.git)
   cd SkillBridge
