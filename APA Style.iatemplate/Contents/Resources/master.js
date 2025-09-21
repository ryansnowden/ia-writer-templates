window.addEventListener('load', function() {

  
  
  var splitFootnotesAndCitations = function() {
    var originalContainer = document.body.getElementsByClassName('footnotes')
    if (originalContainer.length == 0) { return }
  
    var footnoteContainer = document.createElement('div')
    footnoteContainer.setAttribute('class', 'footnotes')
    var footnoteList = document.createElement('ol')
    footnoteContainer.appendChild(footnoteList)
    
    var citationContainer = document.createElement('div')
    citationContainer.setAttribute('class', 'citations')
    var citationList = document.createElement('ul')
    citationContainer.appendChild(citationList)
    
    var appendixContainer = document.createElement('div')
    appendixContainer.setAttribute('class', 'appendix')

    var destinationForItemClassName = function(className) {
      switch (className) {
      case 'citation': return citationList
      default: return footnoteList
      }
    }

    // Separate citations and footnotes.
    var originalListItems = originalContainer[0].getElementsByTagName('ol')[0].getElementsByTagName('li')
    for (var i = 0, l = originalListItems.length; i < l; i++) {
      var item = originalListItems[0]
      destinationForItemClassName(item.className).appendChild(item)
    }
    
    // Sort citation content.
    var citationListItems = citationList.getElementsByTagName('li')
    var citationContent = []
    for (var i = 0, l = citationListItems.length; i < l; i++) {
      citationContent.push(citationListItems[i].innerHTML)
    }
    citationContent.sort(function (a, b) {return a.toLowerCase().localeCompare(b.toLowerCase());});
    // Apply sorted content to citation elements in place.
    for (var i = 0, l = citationListItems.length; i < l; i++) {
      citationListItems[i].innerHTML = citationContent[i]
    }
    
    // Add footnotes page(s) and citation page(s) to appendix
    var footnoteListItems = footnoteList.getElementsByTagName('li')
    
    if (footnoteListItems.length > 0){
      footnoteList.insertAdjacentHTML('beforebegin', '<h1 style="page-break-before: always">Notes</h1>')
      appendixContainer.appendChild(footnoteContainer)
    }

    if (citationListItems.length > 0) {
      citationList.insertAdjacentHTML('beforebegin', '<h1 style="page-break-before: always">References</h1>')
      appendixContainer.appendChild(citationContainer)
    }
    
    originalContainer[0].parentNode.replaceChild(appendixContainer, originalContainer[0])

    console.log("References: " + citationListItems.length)
  }
  
  var relabelFootnotes = function() {
    var footnoteMarkerlist = document.body.getElementsByClassName('footnote')
    for (var i = 0, l = footnoteMarkerlist.length; i < l; i++) {
      footnoteMarkerlist[i].innerHTML = i + 1
    }
  }
  
  var getWordCountExcludingCitations = function() {
    // Get all text content from the document body
    var bodyText = document.body.textContent || document.body.innerText || ''
    
    // Remove content from citations section
    var citationsSection = document.getElementsByClassName('citations')[0]
    if (citationsSection) {
      var citationsText = citationsSection.textContent || citationsSection.innerText || ''
      bodyText = bodyText.replace(citationsText, '')
    }
    
    // Remove content from footnotes section  
    var footnotesSection = document.getElementsByClassName('footnotes')[0]
    if (footnotesSection) {
      var footnotesText = footnotesSection.textContent || footnotesSection.innerText || ''
      bodyText = bodyText.replace(footnotesText, '')
    }
    
    // Remove content from appendix section
    var appendixSection = document.getElementsByClassName('appendix')[0]
    if (appendixSection) {
      var appendixText = appendixSection.textContent || appendixSection.innerText || ''
      bodyText = bodyText.replace(appendixText, '')
    }
    
    // Split into words and filter out empty strings and whitespace
    var words = bodyText.split(/\s+/).filter(function(word) {
      return word.trim().length > 0
    })

    return words.length;
  }
  
  document.body.addEventListener('ia-writer-change', function() {
    splitFootnotesAndCitations()
    relabelFootnotes()

    var wordCount = getWordCountExcludingCitations()
    console.log("Word count: " + wordCount)
  })
})
