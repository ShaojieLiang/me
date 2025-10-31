// Personal Website JavaScript
// Author: Liang Shaojie
// Description: Main JavaScript file for personal website with horizontal scrolling, i18n, theme switching, and form handling

class PersonalWebsite {
    constructor() {
        this.sections = ['home', 'education', 'experience', 'projects', 'contact'];
        this.currentSection = 0;
        this.currentLang = 'zh';
        this.isDarkMode = false;
        this.isScrolling = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserPreferences();
        this.setupIntersectionObserver();
        this.initializeAnimations();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').substring(1);
                this.scrollToSection(section);
            });
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Language toggle
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }

        // Form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }

        // Form validation
        const formInputs = document.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });

        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Scroll event for navigation highlighting
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.addEventListener('scroll', () => {
                this.handleScroll();
            });
        }

        // Smooth scrolling for CTA buttons
        document.querySelectorAll('button[onclick*="scrollToSection"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionName = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.scrollToSection(sectionName);
            });
        });
    }

    scrollToSection(sectionName) {
        const section = document.getElementById(sectionName);
        if (section) {
            const contentArea = document.querySelector('.content-area');
            const sectionTop = section.offsetTop - 64; // Subtract navbar height
            
            contentArea.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
            
            this.currentSection = this.sections.indexOf(sectionName);
            this.updateActiveNavigation();
            this.closeMobileMenu();
        }
    }

    updateActiveNavigation() {
        // Update navigation active states
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === this.sections[this.currentSection]) {
                link.classList.add('active');
            }
        });

        // Update page title
        const sectionTitle = this.sections[this.currentSection];
        document.title = this.getPageTitle(sectionTitle);
    }

    getPageTitle(sectionName) {
        const titles = {
            home: this.currentLang === 'zh' ? '梁绍杰 - 个人主页' : 'Liang Shaojie - Personal Website',
            education: this.currentLang === 'zh' ? '教育经历 - 梁绍杰' : 'Education - Liang Shaojie',
            experience: this.currentLang === 'zh' ? '实习经历 - 梁绍杰' : 'Experience - Liang Shaojie',
            projects: this.currentLang === 'zh' ? '项目展示 - 梁绍杰' : 'Projects - Liang Shaojie',
            contact: this.currentLang === 'zh' ? '联系方式 - 梁绍杰' : 'Contact - Liang Shaojie'
        };
        return titles[sectionName] || titles.home;
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.body.classList.toggle('dark', this.isDarkMode);
        
        // Update theme icon
        const themeIcon = document.querySelector('#themeToggle svg');
        if (themeIcon) {
            if (this.isDarkMode) {
                themeIcon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
            } else {
                themeIcon.innerHTML = '<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>';
            }
        }

        // Save preference
        localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'zh' ? 'en' : 'zh';
        this.updateLanguage();
        
        // Update language button text
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.querySelector('span').textContent = this.currentLang.toUpperCase();
        }

        // Save preference
        localStorage.setItem('language', this.currentLang);
    }

    updateLanguage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            if (translation) {
                if (element.tagName === 'INPUT' && element.type !== 'submit') {
                    element.placeholder = translation;
                } else if (element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update page title
        document.title = this.getPageTitle(this.pages[this.currentPage]);
    }

    getTranslation(key) {
        const translations = {
            zh: {
                // Navigation
                'nav.home': '首页',
                'nav.education': '教育经历',
                'nav.experience': '实习经历',
                'nav.projects': '项目展示',
                'nav.contact': '联系方式',
                'logo': '梁绍杰',

                // Home Page
                'home.title': '梁绍杰',
                'home.subtitle': '数据分析师 / 机器学习工程师',
                'home.description': '热爱数据科学，专注于机器学习算法研究与应用，具备扎实的统计学基础和编程能力，致力于通过数据驱动的方法解决实际问题。',
                'home.stats.experience': '2+',
                'home.stats.experience.label': '年项目经验',
                'home.stats.projects': '10+',
                'home.stats.projects.label': '完成项目',
                'home.stats.skills': '15+',
                'home.stats.skills.label': '技术技能',
                'home.stats.awards': '3',
                'home.stats.awards.label': '获奖证书',
                'home.cta.projects': '查看项目',
                'home.cta.contact': '联系我',

                // Education Page
                'education.title': '教育经历',
                'education.subtitle': '不断学习，持续提升',
                'education.master.time': '2026 - 2027',
                'education.master.degree': '数据科学硕士',
                'education.master.school': '莫纳什大学',
                'education.master.description': '深入学习数据挖掘、机器学习、深度学习等前沿技术，参与实际数据分析项目，提升解决复杂问题的能力。',
                'education.bachelor.time': '2021 - 2025',
                'education.bachelor.degree': '国际贸易学士',
                'education.bachelor.school': '宁波大学',
                'education.bachelor.description': '系统学习经济学理论、国际贸易实务、数据分析基础等课程，为后续数据科学学习奠定坚实基础。',
                'education.skills.title': '核心技能',
                'education.skills.statistics': '统计学',
                'education.skills.python': 'Python',
                'education.skills.ml': '机器学习',
                'education.skills.visualization': '数据可视化',

                // Experience Page
                'experience.title': '实习经历',
                'experience.subtitle': '实践出真知，经验促成长',
                'experience.job1.title': '数据分析实习生',
                'experience.job1.company': '某知名互联网公司',
                'experience.job1.time': '2024.06 - 2024.09',
                'experience.job1.description': '负责用户行为数据的收集、清洗和分析，使用Python和SQL进行数据处理，构建用户画像模型，为产品优化提供数据支持。',
                'experience.job2.title': '数据科学助理',
                'experience.job2.company': '某金融科技公司',
                'experience.job2.time': '2023.12 - 2024.03',
                'experience.job2.description': '参与风控模型的开发与优化，运用机器学习算法进行信用评估，协助构建自动化风控系统，提升风险识别准确率。',
                'experience.achievements.title': '主要成就',
                'experience.achievements.achievement1.title': '数据分析报告优秀奖',
                'experience.achievements.achievement1.description': '基于用户行为数据撰写的分析报告获得部门优秀评价，为产品决策提供重要参考。',
                'experience.achievements.achievement2.title': '模型性能提升',
                'experience.achievements.achievement2.description': '优化风控模型算法，将预测准确率提升15%，显著降低坏账率。',

                // Projects Page
                'projects.title': '项目展示',
                'projects.subtitle': '技术创新，解决实际问题',
                'projects.project1.title': '用户行为分析系统',
                'projects.project1.description': '基于大数据技术栈构建的用户行为分析平台，实时处理用户行为数据，提供多维度分析报表和可视化展示。',
                'projects.project2.title': '智能推荐算法',
                'projects.project2.description': '开发基于协同过滤和深度学习的混合推荐系统，为用户提供个性化内容推荐，提升用户体验和平台粘性。',
                'projects.project3.title': '金融风控模型',
                'projects.project3.description': '构建基于机器学习的金融风控系统，通过多维度数据特征分析，实现实时风险预警和信用评估。',
                'projects.viewDetails': '查看详情',
                'projects.loadMore': '查看更多项目',

                // Contact Page
                'contact.title': '联系方式',
                'contact.subtitle': '让我们一起探讨数据科学的无限可能',
                'contact.form.title': '发送消息',
                'contact.form.name': '姓名',
                'contact.form.name.placeholder': '请输入您的姓名',
                'contact.form.name.error': '请输入有效的姓名',
                'contact.form.email': '邮箱',
                'contact.form.email.placeholder': '请输入您的邮箱地址',
                'contact.form.email.error': '请输入有效的邮箱地址',
                'contact.form.subject': '主题',
                'contact.form.subject.placeholder': '请输入消息主题',
                'contact.form.message': '消息内容',
                'contact.form.message.placeholder': '请输入您的消息内容...',
                'contact.form.message.error': '消息内容不能少于10个字符',
                'contact.form.submit': '发送消息',
                'contact.info.title': '联系信息',
                'contact.info.email': '邮箱',
                'contact.info.location': '位置',
                'contact.info.location.detail': '中国 · 浙江',
                'contact.info.availability': '可接受工作',
                'contact.info.availability.detail': '全职/实习/项目合作',
                'contact.social.title': '社交媒体',

                // Footer
                'footer.copyright': '© 2024 梁绍杰. 保留所有权利.'
            },
            en: {
                // Navigation
                'nav.home': 'Home',
                'nav.education': 'Education',
                'nav.experience': 'Experience',
                'nav.projects': 'Projects',
                'nav.contact': 'Contact',
                'logo': 'Liang Shaojie',

                // Home Page
                'home.title': 'Liang Shaojie',
                'home.subtitle': 'Data Analyst / ML Engineer',
                'home.description': 'Passionate about data science, specializing in machine learning algorithm research and applications. With solid foundations in statistics and programming, committed to solving real-world problems through data-driven approaches.',
                'home.stats.experience': '2+',
                'home.stats.experience.label': 'Years Experience',
                'home.stats.projects': '10+',
                'home.stats.projects.label': 'Projects Completed',
                'home.stats.skills': '15+',
                'home.stats.skills.label': 'Technical Skills',
                'home.stats.awards': '3',
                'home.stats.awards.label': 'Awards & Certificates',
                'home.cta.projects': 'View Projects',
                'home.cta.contact': 'Contact Me',

                // Education Page
                'education.title': 'Education',
                'education.subtitle': 'Continuous Learning, Continuous Growth',
                'education.master.time': '2026 - 2027',
                'education.master.degree': 'Master of Data Science',
                'education.master.school': 'Monash University',
                'education.master.description': 'In-depth study of cutting-edge technologies such as data mining, machine learning, and deep learning, participating in practical data analysis projects to enhance problem-solving capabilities.',
                'education.bachelor.time': '2021 - 2025',
                'education.bachelor.degree': 'Bachelor of International Trade',
                'education.bachelor.school': 'Ningbo University',
                'education.bachelor.description': 'Systematic study of economic theory, international trade practice, data analysis fundamentals, and other courses, laying a solid foundation for subsequent data science learning.',
                'education.skills.title': 'Core Skills',
                'education.skills.statistics': 'Statistics',
                'education.skills.python': 'Python',
                'education.skills.ml': 'Machine Learning',
                'education.skills.visualization': 'Data Visualization',

                // Experience Page
                'experience.title': 'Experience',
                'experience.subtitle': 'Practice Makes Perfect, Experience Promotes Growth',
                'experience.job1.title': 'Data Analysis Intern',
                'experience.job1.company': 'Leading Internet Company',
                'experience.job1.time': '2024.06 - 2024.09',
                'experience.job1.description': 'Responsible for collecting, cleaning, and analyzing user behavior data, using Python and SQL for data processing, building user profile models, and providing data support for product optimization.',
                'experience.job2.title': 'Data Science Assistant',
                'experience.job2.company': 'Fintech Company',
                'experience.job2.time': '2023.12 - 2024.03',
                'experience.job2.description': 'Participated in the development and optimization of risk control models, applied machine learning algorithms for credit assessment, assisted in building automated risk control systems, and improved risk identification accuracy.',
                'experience.achievements.title': 'Key Achievements',
                'experience.achievements.achievement1.title': 'Excellent Data Analysis Report Award',
                'experience.achievements.achievement1.description': 'The analysis report based on user behavior data received excellent evaluation from the department and provided important reference for product decision-making.',
                'experience.achievements.achievement2.title': 'Model Performance Improvement',
                'experience.achievements.achievement2.description': 'Optimized risk control model algorithms, improved prediction accuracy by 15%, and significantly reduced bad debt rates.',

                // Projects Page
                'projects.title': 'Projects',
                'projects.subtitle': 'Technical Innovation, Solving Real Problems',
                'projects.project1.title': 'User Behavior Analysis System',
                'projects.project1.description': 'Built a user behavior analysis platform based on big data technology stack, processing user behavior data in real-time, providing multi-dimensional analysis reports and visualizations.',
                'projects.project2.title': 'Intelligent Recommendation Algorithm',
                'projects.project2.description': 'Developed a hybrid recommendation system based on collaborative filtering and deep learning, providing personalized content recommendations for users and improving user experience and platform engagement.',
                'projects.project3.title': 'Financial Risk Control Model',
                'projects.project3.description': 'Built a machine learning-based financial risk control system, achieving real-time risk warning and credit assessment through multi-dimensional data feature analysis.',
                'projects.viewDetails': 'View Details',
                'projects.loadMore': 'Load More Projects',

                // Contact Page
                'contact.title': 'Contact',
                'contact.subtitle': "Let's Explore the Infinite Possibilities of Data Science Together",
                'contact.form.title': 'Send Message',
                'contact.form.name': 'Name',
                'contact.form.name.placeholder': 'Please enter your name',
                'contact.form.name.error': 'Please enter a valid name',
                'contact.form.email': 'Email',
                'contact.form.email.placeholder': 'Please enter your email address',
                'contact.form.email.error': 'Please enter a valid email address',
                'contact.form.subject': 'Subject',
                'contact.form.subject.placeholder': 'Please enter message subject',
                'contact.form.message': 'Message',
                'contact.form.message.placeholder': 'Please enter your message...',
                'contact.form.message.error': 'Message content must be at least 10 characters',
                'contact.form.submit': 'Send Message',
                'contact.info.title': 'Contact Information',
                'contact.info.email': 'Email',
                'contact.info.location': 'Location',
                'contact.info.location.detail': 'Zhejiang, China',
                'contact.info.availability': 'Available For',
                'contact.info.availability.detail': 'Full-time/Internship/Project Collaboration',
                'contact.social.title': 'Social Media',

                // Footer
                'footer.copyright': '© 2024 Liang Shaojie. All rights reserved.'
            }
        };

        return translations[this.currentLang] && translations[this.currentLang][key];
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
        field.classList.remove('error');

        // Validation rules
        switch (fieldName) {
            case 'name':
                if (!value || value.length < 2) {
                    isValid = false;
                    errorMessage = this.getTranslation('contact.form.name.error');
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value || !emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = this.getTranslation('contact.form.email.error');
                }
                break;
            case 'message':
                if (!value || value.length < 10) {
                    isValid = false;
                    errorMessage = this.getTranslation('contact.form.message.error');
                }
                break;
        }

        // Show error if invalid
        if (!isValid) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.classList.remove('hidden');
            }
        }

        return isValid;
    }

    async handleFormSubmission() {
        const form = document.getElementById('contactForm');
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const submitText = submitBtn.querySelector('.submit-text');
        const loadingSpinner = submitBtn.querySelector('.loading-spinner');
        const formMessage = document.getElementById('formMessage');

        // Validate all fields
        const fields = form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('请检查表单信息', 'error');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        loadingSpinner.classList.remove('hidden');

        try {
            // Simulate form submission (replace with actual email service)
            await this.sendEmail(formData);
            
            // Show success message
            this.showNotification('消息发送成功！我会尽快回复您。', 'success');
            form.reset();
            
        } catch (error) {
            // Show error message
            this.showNotification('发送失败，请稍后重试或直接使用邮箱联系。', 'error');
        } finally {
            // Reset form state
            submitBtn.disabled = false;
            submitText.style.display = 'inline';
            loadingSpinner.classList.add('hidden');
        }
    }

    async sendEmail(formData) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real implementation, you would use an email service like EmailJS, SendGrid, etc.
        // For demo purposes, we'll just simulate success
        return true;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    loadUserPreferences() {
        // Load theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.isDarkMode = savedTheme === 'dark';
            document.body.classList.toggle('dark', this.isDarkMode);
            
            // Update theme icon
            const themeIcon = document.querySelector('#themeToggle svg');
            if (themeIcon && this.isDarkMode) {
                themeIcon.innerHTML = '<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
            }
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.isDarkMode = prefersDark;
            document.body.classList.toggle('dark', this.isDarkMode);
        }

        // Load language preference
        const savedLang = localStorage.getItem('language');
        if (savedLang) {
            this.currentLang = savedLang;
            this.updateLanguage();
            
            // Update language button
            const langToggle = document.getElementById('langToggle');
            if (langToggle) {
                langToggle.querySelector('span').textContent = this.currentLang.toUpperCase();
            }
        }
    }

    setupIntersectionObserver() {
        // Setup intersection observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.project-card, .timeline-item, .stats-card').forEach(el => {
            observer.observe(el);
        });
    }

    initializeAnimations() {
        // Initialize page load animations
        anime({
            targets: '.hero-content > *',
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(200),
            duration: 800,
            easing: 'easeOutExpo'
        });

        // Initialize stats counter animation
        this.animateCounters();
    }

    animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }

    handleResize() {
        // Handle responsive adjustments
        this.updateActiveNavigation();
    }

    handleScroll() {
        // Handle scroll-based animations and effects
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const scrollTop = contentArea.scrollTop;
        const navbar = document.querySelector('nav');
        
        if (navbar) {
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Update active navigation based on scroll position
        this.updateNavigationOnScroll();
    }

    updateNavigationOnScroll() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const scrollTop = contentArea.scrollTop;
        const scrollCenter = scrollTop + contentArea.clientHeight / 2;

        // Find current section based on scroll position
        let currentSectionIndex = 0;
        
        for (let i = 0; i < this.sections.length; i++) {
            const section = document.getElementById(this.sections[i]);
            if (section) {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollCenter >= sectionTop && scrollCenter < sectionBottom) {
                    currentSectionIndex = i;
                    break;
                }
            }
        }

        // Update active navigation if section changed
        if (currentSectionIndex !== this.currentSection) {
            this.currentSection = currentSectionIndex;
            this.updateActiveNavigation();
        }
    }
}

// Global functions for HTML onclick handlers
function scrollToSection(sectionName) {
    if (window.personalWebsite) {
        window.personalWebsite.scrollToSection(sectionName);
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.personalWebsite = new PersonalWebsite();
    
    // Add some additional interactive features
    setupAdditionalFeatures();
});

function setupAdditionalFeatures() {
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                scale: 1.02,
                rotateX: 2,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });

        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                scale: 1,
                rotateX: 0,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });

    // Skill tags animation
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', () => {
            anime({
                targets: tag,
                scale: [1, 1.1, 1],
                duration: 400,
                easing: 'easeOutElastic(1, .8)'
            });
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add particle effect to hero section (optional)
    if (typeof p5 !== 'undefined') {
        setupParticleBackground();
    }
}

function setupParticleBackground() {
    // Simple particle background using p5.js
    const heroSection = document.querySelector('#home');
    if (heroSection) {
        // This would require p5.js library to be loaded
        // For now, we'll skip this feature
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimizations
const debouncedResize = debounce(() => {
    if (window.personalWebsite) {
        window.personalWebsite.handleResize();
    }
}, 250);

const throttledScroll = throttle(() => {
    if (window.personalWebsite) {
        window.personalWebsite.handleScroll();
    }
}, 16);

window.addEventListener('resize', debouncedResize);
window.addEventListener('scroll', throttledScroll);

// Error handling
window.addEventListener('error', (e) => {
    console.error('Website error:', e.error);
});

// Service worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker implementation would go here
        console.log('Service worker support detected');
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonalWebsite;
}