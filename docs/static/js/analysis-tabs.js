document.addEventListener('DOMContentLoaded', function () {
    const analysisButtons = document.querySelectorAll('.chart-controls .chart-control-btn');
    const analysisContentWrapper = document.getElementById('analysis-content-wrapper');

    if (!analysisButtons.length || !analysisContentWrapper) {
        return;
    }
    const analysisContents = Array.from(analysisContentWrapper.children);

    analysisButtons.forEach(button => {
        button.addEventListener('click', function () {
            analysisButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const targetId = this.getAttribute('data-analysis');
            analysisContents.forEach(content => {
                if (content.id === targetId) {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
        });
    });

    // Ensure initial state is consistent
    let activeSet = false;
    analysisButtons.forEach(button => {
        const targetId = button.getAttribute('data-analysis');
        const targetContent = document.getElementById(targetId);
        if (button.classList.contains('active')) {
            if (targetContent) targetContent.style.display = 'block';
            activeSet = true;
        } else {
            if (targetContent) targetContent.style.display = 'none';
        }
    });

    if (!activeSet && analysisButtons.length > 0) {
        analysisButtons[0].classList.add('active');
        const firstTargetId = analysisButtons[0].getAttribute('data-analysis');
        const firstContent = document.getElementById(firstTargetId);
        if (firstContent) firstContent.style.display = 'block';
    }
}); 