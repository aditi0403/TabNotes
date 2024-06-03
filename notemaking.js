document.addEventListener('DOMContentLoaded', function () {
    const libraries = document.querySelectorAll('.library');

    libraries.forEach(library => {
        library.addEventListener('click', function () {
            const libraryIndex = parseInt(library.textContent.match(/\d+/)[0]);
            showModules(libraryIndex);
        });
    });

    async function showModules(libraryIndex) {
        const modulesContainer = document.createElement('div');
        modulesContainer.classList.add('modules-container');

        for (let i = 1; i <= 5; i++) {
            const module = document.createElement('div');
            module.className = 'module';
            module.textContent = `Module ${i}`;
            module.addEventListener('click', function () {
                const moduleIndex = parseInt(module.textContent.match(/\d+/)[0]);
                openTextDocument(libraryIndex, moduleIndex);
            });
            modulesContainer.appendChild(module);
        }

        Swal.fire({
            title: `Library ${libraryIndex}`,
            html: modulesContainer,
            width: '80%',
            padding: '20px',
            background: '#ffffff',
            backdrop: `
                rgba(0,0,123,0.4)
                left top
                no-repeat
            `,
        });
    }

    async function openTextDocument(libraryIndex, moduleIndex) {
        const note = await getNote(libraryIndex, moduleIndex);
    
        const libraryName = `Library ${libraryIndex}`;
        const moduleName = `Module ${moduleIndex}`;
        const { value: text } = await Swal.fire({
            title: `${libraryName} - ${moduleName}`,
            input: 'textarea',
            inputValue: note || '',
            inputAttributes: {
                'aria-label': 'Type your text here',
                style: 'height: 300px' // Adjust the height as needed
            },
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
            width: '90%',
            heightAuto: false,
            customClass: {
                container: 'custom-sw-modal'
            }
        });
    
        if (text !== undefined) { // Only save if user clicks "Save"
            saveNote(libraryIndex, moduleIndex, text);
            Swal.fire(
                'Saved!',
                'Your text document has been saved.',
                'success'
            );
        }
    }
    
    

    async function saveNote(libraryIndex, moduleIndex, note) {
        try {
          const response = await fetch('http://localhost:3000/notes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ libraryIndex, moduleIndex, note }),
          });
      
          if (!response.ok) {
            throw new Error('Failed to save note');
          }
        } catch (error) {
          console.error('Error saving note:', error);
        }
      }
      
    async function getNote(libraryIndex, moduleIndex) {
        try {
            const response = await fetch(`/notes?libraryIndex=${libraryIndex}&moduleIndex=${moduleIndex}`);
            if (!response.ok) {
                throw new Error('Failed to fetch note');
            }
            const data = await response.json();
            return data.note || '';
        } catch (error) {
            console.error('Error fetching note:', error);
            return '';
        }
    }
});
