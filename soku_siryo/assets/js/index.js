function validateAgree(e){
    var agree = document.getElementById('agree');
    if(!agree || agree.checked) return true;
    alert('プライバシーポリシーへの同意が必要です');
    e.preventDefault();
    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    loadHeader().then(() => {
        const header = document.querySelector('.main-header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
    });
    loadFooter();

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const toggle = question.querySelector('.faq-toggle');

        question.addEventListener('click', () => {
            const isActive = item.classList.toggle('active');
            if (isActive) {
                toggle.textContent = '×';
                toggle.style.transform = 'rotate(0deg)';
            } else {
                toggle.textContent = '+';
                toggle.style.transform = 'rotate(-45deg)';
            }
        });
    });

    const fadeInElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1
    });

    fadeInElements.forEach(el => {
        observer.observe(el);
    });

    // PDF.js Viewer Logic
    const pdfUrl = 'assets/pdf/sample-proposal.pdf';
    const canvas = document.getElementById('pdf-canvas');
    if (canvas) { // Check if the canvas element exists
        const ctx = canvas.getContext('2d');
        const pageNumSpan = document.getElementById('page-num');
        const pageCountSpan = document.getElementById('page-count');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        let pdfDoc = null;
        let pageNum = 1;
        let pageRendering = false;
        let pageNumPending = null;

        const renderPage = num => {
            pageRendering = true;
            // Get page
            pdfDoc.getPage(num).then(page => {
                const container = document.querySelector('.pdf-viewer-container');
                const scale = container.clientWidth / page.getViewport({ scale: 1.0 }).width;
                const viewport = page.getViewport({ scale: scale });

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                const renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
                const renderTask = page.render(renderContext);

                renderTask.promise.then(() => {
                    pageRendering = false;
                    if (pageNumPending !== null) {
                        renderPage(pageNumPending);
                        pageNumPending = null;
                    }
                });
            });

            // Update page counters and button states
            pageNumSpan.textContent = num;
            prevBtn.disabled = num <= 1;
            nextBtn.disabled = num >= pdfDoc.numPages;
        };

        const queueRenderPage = num => {
            if (pageRendering) {
                pageNumPending = num;
            } else {
                renderPage(num);
            }
        };

        const onPrevPage = () => {
            if (pageNum <= 1) {
                return;
            }
            pageNum--;
            queueRenderPage(pageNum);
        };

        const onNextPage = () => {
            if (pageNum >= pdfDoc.numPages) {
                return;
            }
            pageNum++;
            queueRenderPage(pageNum);
        };

        prevBtn.addEventListener('click', onPrevPage);
        nextBtn.addEventListener('click', onNextPage);

        // Load the PDF
        pdfjsLib.getDocument(pdfUrl).promise.then(doc => {
            pdfDoc = doc;
            pageCountSpan.textContent = pdfDoc.numPages;
            renderPage(pageNum);
        }).catch(err => {
            console.error('Error loading PDF: ' + err);
            const viewer = document.querySelector('.pdf-viewer-container');
            if(viewer) {
                viewer.innerHTML = '<p style="text-align:center; color:red;">PDFの読み込みに失敗しました。</p>';
            }
        });
    }

    // Ensure contact form posts correctly (defensive)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.setAttribute('method', 'POST');
        // Ensure _next is an absolute URL (FormSubmit requires absolute)
        const nextInput = contactForm.querySelector('input[name="_next"]');
        if (nextInput) {
            try {
                if (location.protocol === 'http:' || location.protocol === 'https:') {
                    const abs = new URL('thankyou.html', window.location.href).href;
                    nextInput.value = abs;
                }
            } catch (e) {}
        }
    }
});
