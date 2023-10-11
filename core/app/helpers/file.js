export const file = {
  export:{
    file: null,
    text: (text, typ, fn) => {
      const type = typ || 'text/plain'
      var data = new Blob([text], {type});
  
      // If we are replacing a previously generated file we need to
      // manually revoke the object URL to avoid memory leaks.
      if (file.export.file !== null) {
        window.URL.revokeObjectURL(file.export.file);
      }
  
      file.export.file = window.URL.createObjectURL(data);
      /*
      var link = document.createElement("a");
      link.download = '4ft.css';
      link.innerHTML = "Export UIKit";
      link.style.display = "none"
      document.body.appendChild(link)
      link.click() */
      setTimeout(function() {file.download(text, typ, fn)}, 500)
      console.log('dw?')
      // returns a URL you can use as a href
      return file.export.file;
    }
  },
  download: (content, typ, fn) => {
        var pp = document.createElement('a');
        pp.setAttribute('href', `data:${typ};charset=utf-8,` + encodeURIComponent(content));
        pp.setAttribute('download', fn);
        pp.click();
    }
  }