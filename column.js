const Column = {
	idCounter: 4,
	dragged: null,
	dropped: null,

	// при клике добавляем заметку
	process (columnElement) {
	    const spanAction__addNote = columnElement.querySelector('[data-action-addNote]');

	    spanAction__addNote.addEventListener('click', function(event) {
	    	const noteElement = Note.create();

	        columnElement.querySelector('[data-notes]').append(noteElement);


	        //при создании карточки сразу переходим в ее заполнение
	        noteElement.setAttribute('contenteditable', true)
	        noteElement.focus()
	    });

	    const headerElement = columnElement.querySelector('.column-header');

	    headerElement.addEventListener('dblclick', function(event) {
	        headerElement.setAttribute('contenteditable', true);
	        headerElement.focus();
	    })

	    headerElement.addEventListener('blur', function(event) {
	        headerElement.removeAttribute('contenteditable');
	    })

	    columnElement.addEventListener('dragstart', Column.dragstart)
		columnElement.addEventListener('dragend', Column.dragend)
	
		columnElement.addEventListener('dragover', Column.dragover)
	    
	    // добавляем возможность переносить заметки в колонки где нет еще заметок
	    columnElement.addEventListener('drop', Column.drop)
	},

	create(id = null) {
		const columnElement = document.createElement('div');
            columnElement.classList.add('column');
			columnElement.setAttribute('draggable', true);
			
			if(id){
				columnElement.setAttribute('data-column-id', id);
			}
			else{
				columnElement.setAttribute('data-column-id', Column.idCounter);
				Column.idCounter++
			}
            

            columnElement.innerHTML = 
            `<p class="column-header" title="Double click to edit">New list</p>
             <div data-notes></div>
             <p class="column-footer">
                <span data-action-addNote class="action">+ Add note</span>
             </p>`;

            //для новых колонок даем возможность создавать заметки
			 Column.process(columnElement);
			 
			 return columnElement
	},

	dragstart(event) {
		Column.dragged = this
		Column.dragged.classList.add('dragged')

		event.stopPropagation();

		document.querySelectorAll('.note').forEach(noteElement => noteElement.removeAttribute('draggable'))
	},

	dragend (event) {
		Column.dragged.classList.remove('dragged')
		Column.dragged = null
		Column.dropped = null

		document.querySelectorAll('.note').forEach(noteElement => noteElement.setAttribute('draggable', true))
	},

	dragover (event) {
		event.preventDefault();
		event.stopPropagation();

		if (Column.dragged === this ) {
			if (Column.dropped) {
				Column.dropped.classList.remove('under')
			}
			Column.dropped = null
		}
		if (!Column.dragged || Column.dragged === this) {
			return
		}

		Column.dropped = this

		document.querySelectorAll('.column').forEach(columnElement => columnElement.classList.remove('under'))
	
		this.classList.add('under')
	},	 

	drop (event) {
		if(Note.dragged) {
            return this.querySelector('[data-notes]').append(Note.dragged);
		} 
		
		else if (Column.dragged){
			const children = Array.from(document.querySelector('.columns').children);
			const indexA = children.indexOf(this)
			const indexB = children.indexOf(Column.dragged)

			if( indexA < indexB ) {
				document.querySelector('.columns').insertBefore(Column.dragged, this)
			}

			else{
				document.querySelector('.columns').insertBefore(Column.dragged, this.nextElementSibling)
			}

			document.querySelectorAll('.column').forEach(columnElement => columnElement.classList.remove('under'))
	

		}
	}

}