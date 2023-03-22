function openModal (modalSelector, modalTimerId) {//Далее передаем этот селектор во всех случаях когда будем вызывать эту функцию
    const modal = document.querySelector(modalSelector);

    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';

    console.log(modalTimerId)
    if (modalTimerId) {//if parameter (actually)exists or given then clear
         clearInterval(modalTimerId)//если пользователь сам откроет модалку, то мы очистим и больше не показываем его
    }
   
    //window.removeEventListener('scroll', showModalByScroll);
 };
      
function closeModal (modalSelector) {
    const modal = document.querySelector(modalSelector);//аналогично как и с openModal передаем селектор везде где будем вызывать

    modal.classList.add('hide');
    modal.classList.remove('show');
   // modal.classList.remove('hide'); 
    document.body.style.overflow = '';
} //эти функции будут использованы в других модулях, а потому экспортируем

function modal (triggerSelector, modalSelector, modalTimerId) { 

    //Modal window
    
    const modalTrigger  = document.querySelectorAll(triggerSelector),
          //modalCloseBtn  = document.querySelector('[data-close]'); больше не нужно, так как на новых динамических элементах не будут работать обработчики события, повесим делегирование событий
          modal = document.querySelector(modalSelector); 

         
    modalTrigger.forEach((btn) => {
        btn.addEventListener('click', () => openModal(modalSelector, modalTimerId))
    });
    
    //modalCloseBtn.addEventListener('click', closeModal);  на создаваемых динамически новых элементах не будут работать обработчики события, повесим делегирование событий
    
    modal.addEventListener('click', (e) => { 
        if (e.target === modal || e.target.getAttribute('data-close') == '') { // заменили обработчик modalCloseBtn на делегирование событий по атрибуту ('data-close') == '' в modal, будет работать и на новых эелементах        
            closeModal(modalSelector);
        }
    });  
    
    document.addEventListener('keydown', (e) => {
        if(e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal(modalSelector);
        }
    })
    
    
    function showModalByScroll () {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll);
        } 
    }
    
    window.addEventListener('scroll', showModalByScroll);
};

export default modal;
export {closeModal};
export {openModal};