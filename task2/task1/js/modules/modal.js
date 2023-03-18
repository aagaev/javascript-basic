function modal () { 

    //Modal window
    
    const modalTrigger  = document.querySelectorAll('[data-modal]'),
          //modalCloseBtn  = document.querySelector('[data-close]'); больше не нужно, так как на новых динамических элементах не будут работать обработчики события, повесим делегирование событий
          modal = document.querySelector('.modal'); 
     function openModal () {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId)
        //window.removeEventListener('scroll', showModalByScroll);
     };
          
     function closeModal () {
        modal.classList.add('hide');
        modal.classList.remove('show');
       // modal.classList.remove('hide'); 
        document.body.style.overflow = '';
    }
         
    modalTrigger.forEach((btn) => {
        btn.addEventListener('click', openModal)
    });
    
    //modalCloseBtn.addEventListener('click', closeModal);  на создаваемых динамически новых элементах не будут работать обработчики события, повесим делегирование событий
    
    modal.addEventListener('click', (e) => { 
        if (e.target === modal || e.target.getAttribute('data-close') == '') { // заменили обработчик modalCloseBtn на делегирование событий по атрибуту ('data-close') == '' в modal, будет работать и на новых эелементах        
            closeModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if(e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    })
    
    const modalTimerId = setTimeout(openModal, 50000); 
    
    function showModalByScroll () {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    
    window.addEventListener('scroll', showModalByScroll);
};

module.exports = modal;