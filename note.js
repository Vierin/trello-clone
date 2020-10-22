const Note = {
	idCounter: 8,
	dragged: null, // здесь будет елемент каторый сечас перетаскивается

	// при двойном клике даем возможность изменять заметку
	process (noteElement) {
				//при двойном клике изменяем содержимое заметки
			    noteElement.addEventListener('dblclick', function() {
		        //запрещаем переносить карточку в то время когда она редактируется
		        noteElement.setAttribute('contenteditable', true);
		        noteElement.removeAttribute('draggable')
		        //closest() ищет как querySelector только не по дочерним елементам а по родительский
		        noteElement.closest('.column').removeAttribute('draggable')
		        noteElement.focus();
		    })
		    // при 
		    noteElement.addEventListener('blur', function() {
		        noteElement.removeAttribute('contenteditable');
		        noteElement.setAttribute('draggable', true)
		        noteElement.closest('.column').setAttribute('draggable', true)
		        
		        if (!noteElement.textContent.trim().length) {
		            noteElement.remove();
		        }
		    })

		    noteElement.addEventListener('dragstart', Note.dragstart)
		    noteElement.addEventListener('dragend', Note.dragend)
		    noteElement.addEventListener('dragenter', Note.dragenter)
		    noteElement.addEventListener('dragover', Note.dragover)
		    noteElement.addEventListener('dragleave', Note.dragleave)
		    noteElement.addEventListener('drop', Note.drop)
		},

		create (id = null, content = '') {
			const noteElement = document.createElement('div');

	        noteElement.classList.add('note');
			noteElement.setAttribute('draggable', 'true')
			noteElement.textContent = content
			
			// проверяем есть ли уже в сохраненных записи с id и еслсси нет создаем новые с новыми id
			if (id) {
				noteElement.setAttribute('data-note-id', id)
			}
			else {
				noteElement.setAttribute('data-note-id', Note.idCounter)
				Note.idCounter++
			}
	        
	        // для новосозданых елементов добавляем возможность изменять содержимое
	        Note.process(noteElement);

	        return noteElement
		},

		dragstart (event) {
		    Note.dragged = this // узнаем какой елемент перетаскиваем
		    this.classList.add('dragged')
		    event.stopPropagation();
		},

		dragend (event) {
			event.stopPropagation();

		    Note.dragged = null  // очищаем ссылку
		    this.classList.remove('dragged')

		    document.querySelectorAll('.note').forEach(e => {
		        e.classList.remove('under')
			});

		},

		dragenter (event) {
			event.stopPropagation();

		    if(!Note.dragged || this === Note.dragged) {
		        return
		    }
		    this.classList.add('under')
		},

		dragover (event) {
			event.preventDefault();
			event.stopPropagation();

		    if (!Note.dragged || this === Note.dragged) {
		        return
		    }
		},

		dragleave (event) {
			event.stopPropagation();

		    if (!Note.dragged || this === Note.dragged) {
		        return // проверяем если это одно и тоже то отменяем обработку события
		    }
		    this.classList.remove('under')
		},

		drop (event) {
		    event.stopPropagation()

		    if (!Note.dragged || this === Note.dragged) {
		        return 
		     }
		    
		     //проверяем находяться ли заметки в одной и той же колонке, переносимая и на которая под ней
		     if( this.parentElement === Note.dragged.parentElement) {
		         //получаем все заметки в колонке
		          const note = Array.from(this.parentElement.querySelectorAll('.note'))
		          const indexA = note.indexOf(this)
		          const indexB = note.indexOf(Note.dragged)

		          if(indexA < indexB){

		            this.parentElement.insertBefore(Note.dragged, this);

		          } else {
		            // вставляем перед его следующим соседом
		            this.parentElement.insertBefore(Note.dragged, this.nextElementSibling);

		          }

		     } else{ // для переноса с одной колонки в другую
		         this.parentElement.insertBefore(Note.dragged, this); // вставить елемент перед, insertBefore вырезает елемент с одного песта и переносит в другое
		     }
		}

}

