document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const topWordsDiv = document.getElementById('top-words');
  const topCoOccurrencesDiv = document.getElementById('top-co-occurrences');
  const wordFrequenciesDiv = document.getElementById('frequency');
  const searchInput = document.getElementById('search-input');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      // Display top words
      const topWordsList = data.topWords.map((word) => `<li>${word}</li>`).join('');
      topWordsDiv.innerHTML = `<h2>Top Words</h2><ul>${topWordsList}</ul>`;

      // Display top co-occurrences
      const topCoOccurrencesList = data.topCoOccurrences.map((pair) => `<li>${pair}</li>`).join('');
      topCoOccurrencesDiv.innerHTML = `<h2>Top Co-Occurrences</h2><ul>${topCoOccurrencesList}</ul>`;

      // Display word frequencies
      const wordFrequenciesList = Object.entries(data.wordFrequencies)
        .map(([word, frequency]) => `<li>${word}: ${frequency}</li>`).join('');
      wordFrequenciesDiv.innerHTML = `<h2>Word Frequencies</h2><ul>${wordFrequenciesList}</ul>`;

      // Implement client-side keyword search
      searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.toLowerCase();
        const wordListItems = document.querySelectorAll('ul li');

        wordListItems.forEach((wordItem) => {
          const wordText = wordItem.textContent.toLowerCase();
          if (wordText.includes(searchValue)) {
            wordItem.style.display = 'block';
          } else {
            wordItem.style.display = 'none';
          }
        });
      });

    } catch (error) {
      console.error('Error:', error);
    }
  });
});
