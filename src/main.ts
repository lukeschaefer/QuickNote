import './style.css'

// Function to generate date-based ID
function generateDateId(): string {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
}

// Function to format date for note header
function formatDateHeader(): string {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  const formattedDate = today.toLocaleDateString('en-US', options);
  const underline = '='.repeat(formattedDate.length);
  return `${formattedDate}\n${underline}\n\n`;
}

// Debounce function
function debounce(func: Function, wait: number) {
  let timeout: number;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const note = document.getElementById('note') as HTMLDivElement;
const noteSelection = document.getElementById('note-selection') as HTMLSelectElement;

if (note && noteSelection) {
  // Generate date ID
  const dateId = generateDateId();

  // Function to populate select dropdown with all localStorage entries
  function populateNoteSelection() {
    // Clear existing options
    noteSelection.innerHTML = '';

    // Get all localStorage keys (date IDs)
    const keys = Object.keys(localStorage).sort().reverse(); // Sort by date descending

    // Add current date if not in localStorage yet
    if (!keys.includes(dateId)) {
      keys.unshift(dateId); // Add to beginning
    }

    // Populate dropdown
    keys.forEach(key => {
      // Validate that the key is a valid date
      const date = new Date(key + 'T00:00:00');
      if (isNaN(date.getTime())) {
        // Skip invalid dates
        return;
      }

      const option = document.createElement('option');
      option.value = key;

      // Format the date for display
      const displayOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      option.textContent = date.toLocaleDateString('en-US', displayOptions);

      // Set current date as selected
      if (key === dateId) {
        option.selected = true;
      }

      noteSelection.appendChild(option);
    });
  }

  // Function to load note content
  function loadNote(dateId: string) {
    // Validate date ID before proceeding
    const testDate = new Date(dateId + 'T00:00:00');
    if (isNaN(testDate.getTime())) {
      console.warn(`Invalid date ID: ${dateId}`);
      return;
    }

    const existingNote = localStorage.getItem(dateId);
    if (existingNote) {
      note.innerHTML = existingNote;
    } else {
      // Create new note with formatted date header
      const newNoteContent = formatDateHeader();
      note.innerHTML = newNoteContent;
      localStorage.setItem(dateId, newNoteContent);
    }
  }

  // Initialize
  populateNoteSelection();
  loadNote(dateId);

  // Get current selected ID
  let currentNoteId = dateId;

  // Debounced save function
  const saveNote = debounce(() => {
    const content = note.innerHTML;
    localStorage.setItem(currentNoteId, content);
  }, 150); // Save after 150ms of no typing

  // Handle selection change
  noteSelection.addEventListener('change', () => {
    currentNoteId = noteSelection.value;
    loadNote(currentNoteId);
  });

  // Add keyup listener for saving
  note.addEventListener('keyup', saveNote);

  // Existing tab handling
  note.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '&#009');
    }
  });
}
