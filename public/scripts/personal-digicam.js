(function(){
    const wrap   = document.querySelector('.camera-wrap');
    if (!wrap) return;

    const slides = [...wrap.querySelectorAll('.screen-img')];
    const prev   = wrap.querySelector('.prev');
    const next   = wrap.querySelector('.next');

    const bar    = document.querySelector('.caption-bar');
    const idxEl  = bar?.querySelector('.caption-index');
    const txtEl  = bar?.querySelector('.caption-text');

    let i = slides.findIndex(s => s.classList.contains('is-active'));
    if (i < 0) i = 0;

    function renderCaption(){
        if (!bar) return;
        const caption = slides[i].dataset.caption || 'Untitled';
        if (idxEl) idxEl.textContent = `${i+1}/${slides.length}`;
        if (txtEl) txtEl.textContent = caption;
    }

    function show(n){
        slides[i].classList.remove('is-active');
        i = (n + slides.length) % slides.length;
        slides[i].classList.add('is-active');
        renderCaption();
    }

    prev.addEventListener('click', () => show(i - 1));
    next.addEventListener('click', () => show(i + 1));

    // keyboard support
    wrap.tabIndex = 0;
    wrap.addEventListener('keydown', (e)=>{
        if (e.key === 'ArrowLeft')  show(i - 1);
        if (e.key === 'ArrowRight') show(i + 1);
    });

    // init
    renderCaption();
})();
