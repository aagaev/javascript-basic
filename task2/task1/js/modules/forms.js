function forms () { //Forms

    const forms = document.querySelectorAll('form')
    
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Thanks. We will contact you soon',
        failure: 'Something wrong'
    }
    
    forms.forEach(item => {
        bindPostData(item);
    }) //берем нащи формы (form) и под каждую подвязываем функцию postData 
    
    const postData = async (url, data) => { // function expression - Method POST
        const res = await fetch(url, { //res is a promise so we can use .json() and return it
            method: 'POST',
            headers: { 
                'Content-type': 'application/json'
            },
            body: data
        })
        return await res.json(); //промис из fetch обработаем методом json()  и вернем из функции postData  
               // res.json() это тоже промис, мы возвращаем из функции промис
               // и дальше мы его сможем через цепочку .then() обработать как нам надо
    }
    
    function bindPostData(form) { //
        form.addEventListener('submit', (e) => {
            e.preventDefault();
    
            //const statusMessage = document.createElement('div'); 
            //statusMessage.textContent = message.loading; 
            const statusMessage = document.createElement('img');       
            statusMessage.src = message.loading 
            statusMessage.style.cssText = ` 
                display: block; 
                margin: 0 auto; 
            `
            //form.append(statusMessage);  вмещает элемент прямо внутри формы, неудобно если верстка на флексах
            form.insertAdjacentElement('afterend', statusMessage); //более гибкий чем form.append, элемент будет добавляться после формы, удобно при флексах и не сплющивает(сжимает) форму
            
            // const request = new XMLHttpRequest(); заменяем на технологию FETCH
            // request.open('POST', 'server.php');  заменяем на технологию FETCH
    
            //request.setRequestHeader('Content-type', 'multipart/form-data'); в обычном формате заголовки не нужны когда используем связку XMLHttpRequest и FormData - он установится автоматически
            //request.setRequestHeader('Content-type', 'application/json'); в формате JSON заголовки нужны в таком виде, ныне используется FETCH, смотри выше
           
            // const formData = new FormData(form); //данные которые заполнил пользователь в form&input.value сможем получить в js и отправить на сервер в виде объекта, также есть ключ значение
    
            // const object = {}; //для того чтобы отправить JSON запрос, создаем пустой объект, в который мы затем при помощи перебора поместим данные которые есть в formData
    
            // formData.forEach(function(key, value) {
            //     object[key] = value; // на основании данных которые есть в formData мы сформируем объект object при помощи перебора
            // });
    
            // const json = JSON.stringify(object); //далее обычный объект object превращаем в формат JSON, то есть трансформация new FormData формата в JSON формат 
            
            // fetch('server.php', {
            //     method: 'POST',
            //     headers: { //заголовки нужны когда отправляем JSON формате
            //         'Content-type': 'application/json'
            //     },
            //     body: json //fetch возвращает нам Промис => data, который мы затем обрабатываем в .then()
            // })
            
    
            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries())); // formData.entries() - берет formData и превращает в массив массивов для того чтоы могли нормально работать с ней.
            //Затем Object.fromEntries(formData.entries()) превращает массив массивов в классический обьект, а затем этот классический обьект превращаем в JSON для отправки на сервер
    
            postData(' http://localhost:3000/requests', json)
            // .then(data => data.text()) //модифицируем данные чтобы мы могли их получить
            .then(data => { //data это те данные, которые нам возвращаются из Промиса, то есть которые нам вернул сервер
                console.log(data); // request.response === data ** уточнение - с сервера возвращается data но не JSON
                showThanksModal(message.success);
                form.reset(); //очищаем форму
                statusMessage.remove(); //удаляем спиннер
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset(); //очищаем форму, выполняется всегда независимо как закончился запрос
            })
    
            //request.send(json);
            // request.send(formData);
    
            // request.addEventListener('load', () => {
            //     if (request.status === 200) {
            //         console.log(request.response);
            //         showThanksModal(message.success);
            //         form.reset();
            //         statusMessage.remove();
            //     } else {
            //         showThanksModal(message.failure);
            //     }
            // })
        })
    }
    
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
    
        prevModalDialog.classList.add('hide');
        openModal();//нужен для нижней секции, чтоб появилось подложка
    
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 6000);
    }
    
    // fetch('http://localhost:3000/menu') //обращаемся к db.json same as (http://localhost:3000/menu) откуда будет возвращаться промис 
    //     .then(data => data.json()) //Берем ответ от сервера (data) и превращаем в обычный 
    //     .then(res => console.log(res)) // и далее берем тот результат и выводим в консоль
}

module.exports = forms;