window.onerror = (event, source, lineno, colno, error) => {
  document.body.className = "criticalError";
  document.getElementById("app").innerHTML = `
    <div>
      <h1>An error has occurred:</h1>
      <h2>${error.toString()}<br/>
        <span style="font-size:16px">at ${source}:${lineno}:${colno}<br></span>
      </h2>
      
      <pre>${error.stack}</pre>
      <br><br>
      Please copy this text and send it to the developers.<br>
      <a href="https://discord.gg/fcEXYjPQ43" target="_blank"><button>Discord</button></a><br><br>
      Additionally, you can download the save for bug reporting.<br>
      <button>Download (not implemented)</button>
    </div>
  `;
};
