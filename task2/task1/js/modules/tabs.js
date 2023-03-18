function tabs () { 
	//Tabs
	const tabs = document.querySelectorAll('.tabheader__item'),
		  tabsContent = document.querySelectorAll('.tabcontent'),
		  tabsParent = document.querySelector('.tabheader__items');
	
	function hideTabContent () {
		tabsContent.forEach((item) => {
			//item.style.display = 'none';
			item.classList.remove('show', 'fade')
			item.classList.add('hide')
			
		 })
	
		 tabs.forEach((item) => {   
			item.classList.remove('tabheader__item_active');
		 }); 
	}
	
	function showTabContent (i=0) {
	   
		//tabsContent[i].style.display = 'block';
		tabsContent[i].classList.remove('hide')
		tabsContent[i].classList.add('show', 'fade')
		tabs[i].classList.add('tabheader__item_active');
	}
	
	hideTabContent();
	showTabContent ();
	
	
	tabsParent.addEventListener('click', (event)=> {
		//const target = event.target;
		if (event.target && event.target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (item == event.target) {  
					hideTabContent();
					showTabContent (i); 
				}
			});
		}
	});
}

module.exports = tabs;