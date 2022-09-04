class Select {
	constructor() {
		this.elements = {
			select: !document.querySelector('[data-select]') ? false : document.querySelector('[data-select]'),
			selectArea: document.createElement('div'),
			title: document.createElement('div'),
			list: document.createElement('ul'),
		};

		this.classes = {
			selectArea: 'select-area',
			title: 'select-title',
			list: 'select-list',
			listItem: 'select-list-item'
		};

		this.attr = {
			disabled: false,
			selected: false
		}
	}

	addClass(el, cls) {
		return el.classList.add(cls);
	}
	remClass(el, cls) {
		return el.classList.remove(cls);
	}

	init() {
		this.createSelectArea(this.getOptionContentSelect());
		this.hideAndShowClassesAndAttr();
	}

	getOptionContentSelect() {
		let content = [];
		if(this.elements.select) {
			this.addClass(this.elements.select, 'd-none');
			let option = this.elements.select.querySelectorAll('option');
			for(let item of option) {
				content.push({
					value: (item.value !== null || true) ? item.value : '',
					text: item.textContent === '' ? ' - ' : item.textContent,
					disabled: !!item.hasAttribute('disabled'),
				})
			}
		} else {
			return console.log('error: Поставь дата атрибут (data-select) в select');
		}
		return content;
	}

	createSelectArea(arr) {
		if(arr === undefined || arr === false || arr.length === '') {
			return;
		}
		this.addClass(this.elements.selectArea, this.classes.selectArea);
		this.addClass(this.elements.title, this.classes.title);
		this.addClass(this.elements.list, this.classes.list);

		for(let item of arr) {
			let li = document.createElement('li');
			this.addClass(li, this.classes.listItem);
			li.innerHTML = `
				<span data-value=${item.value}>${item.text}</span>
			`;
			if(item.disabled === true) {
				li.setAttribute('disabled', '');
			}
			this.elements.list.append(li);
		}

		let title = this.elements.select.getAttribute('data-description');
		if (!title) {
			this.elements.select.setAttribute('data-description', arr[0].text);
			this.elements.title.innerText = this.elements.select.getAttribute('data-description');
			let li = this.elements.list.querySelector('li');
			this.addClass(li, 'active');
		} else {
			this.elements.title.innerText = this.elements.select.getAttribute('data-description');
		}

		this.elements.selectArea.append(this.elements.title); this.elements.selectArea.append(this.elements.list);
		let nextElement = this.elements.select;
		nextElement.parentNode.append(this.elements.selectArea);
	}

	dataSelect(el) {
		let option = this.elements.select.options;
		for(let i = 0; i < option.length; i++) {
			if(el === option[i].getAttribute('value')) {
				option[i].value = el;
				for(let item of option) {
					item.removeAttribute('selected');
				}
				option[i].setAttribute('selected', '');
			}
		}
	}

	connectSelectAndList(currentEl) {
		let elem = currentEl.target;
		if(elem.tagName === 'LI') {
			let dataValue = elem.querySelector('span');
			this.dataSelect(dataValue.getAttribute('data-value'));
		} else if(elem.tagName === 'SPAN') {
			this.dataSelect(elem.getAttribute('data-value'));
		}
	}

	hideAndShowClassesAndAttr() {
		const selectItem = this.elements.selectArea.querySelectorAll('.select-list-item');
		const selectArea = this.elements.selectArea;
		this.elements.title.addEventListener('click', () => {
			selectArea.classList.toggle('active');
		});

		for(let item of selectItem) {
			item.addEventListener('click', (e) => {
				this.elements.title.textContent = e.target.textContent;
				for(let el of selectItem) {
					this.remClass(el, 'active');
				}
				this.addClass(e.target, 'active');
				this.remClass(this.elements.selectArea, 'active');
				this.connectSelectAndList(e);
			})
		}
	}
}

new Select().init();
