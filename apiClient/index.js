const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const port = process.env.PORT || 8880

// POST method for endpoint /sign
app.post('/sign', (req, res) => {
  const param1 = req.body.parameter1; // Invoice file content in base64 format (XML file)
  const param2 = req.body.parameter2; // Signed invoice name

  // Write the base64 content to a temporary file
  const tempPath = path.join(__dirname, 'temp', `${Math.random().toString(36).substring(7)}.xml`);
  fs.writeFile(tempPath, Buffer.from(param1, 'base64'), (err) => {
    if (err) {
      console.error(`Error writing invoice file: ${err.message}`);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Execute the shell script with the temporary file path and output file path
    const outputFilePath = path.join(__dirname, 'output', `${Math.random().toString(36).substring(7)}-${param2}`);
    const shellCommand = `fatoora -sign -invoice ${tempPath} -signedInvoice ${outputFilePath}`;

    executeShellCommand(shellCommand, res, outputFilePath);
  });
});

// POST method for endpoint /qr
app.post('/qr', (req, res) => {
    const param1 = req.body.parameter1; // QR file content in base64 format (XML file)
  
    // Write the base64 content to a temporary file
    const tempPath = path.join(__dirname, 'temp', `${Math.random().toString(36).substring(7)}.xml`);
    fs.writeFile(tempPath, Buffer.from(param1, 'base64'), (err) => {
      if (err) {
        console.error(`Error writing QR file: ${err.message}`);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      // Execute the shell script with the temporary file path
      const shellCommand = `fatoora -qr -invoice ${tempPath}`;
  
      executeShellCommand(shellCommand, res, tempPath);
    });
  });

// POST method for endpoint /generatehash
app.post('/generatehash', (req, res) => {
    const param1 = req.body.parameter1; // QR file content in base64 format (XML file)
  
    // Write the base64 content to a temporary file
    const tempPath = path.join(__dirname, 'temp', `${Math.random().toString(36).substring(7)}.xml`);
    fs.writeFile(tempPath, Buffer.from(param1, 'base64'), (err) => {
      if (err) {
        console.error(`Error writing QR file: ${err.message}`);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      // Execute the shell script with the temporary file path
      const shellCommand = `fatoora -generatehash -invoice ${tempPath}`;
  
      executeShellCommand(shellCommand, res, tempPath);
    });
  });
  

// POST method for endpoint /invoicerequest
app.post('/invoicerequest', (req, res) => {
    const param1 = req.body.parameter1; // Invoice file content in base64 format (XML file)
    const param2 = req.body.parameter2; // Signed invoice name
    const param3 = req.body.parameter3; // Output file name
  
    // Write the base64 content to a temporary file
    const tempPath = path.join(__dirname, 'temp', `${Math.random().toString(36).substring(7)}.xml`);
    fs.writeFile(tempPath, Buffer.from(param1, 'base64'), (err) => {
      if (err) {
        console.error(`Error writing invoice file: ${err.message}`);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      // Execute the shell script with the temporary file path and output file path
      const outputFilePath = path.join(__dirname, 'output', `${Math.random().toString(36).substring(7)}-${param3}`);
      const shellCommand = `fatoora -invoicerequest -invoice ${tempPath} -apiRequest ${outputFilePath}`;
  
      executeShellCommand(shellCommand, res, outputFilePath, tempPath);
    });
  });

// Function to execute shell command and send the response
function executeShellCommand(command, res, outputFilePath) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing shell command: ${error.message}`);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (stderr) {
      console.error(`Shell command error: ${stderr}`);
      res.status(400).send('Bad Request');
      return;
    }

    // Read the output file and send it as the response
    fs.readFile(outputFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading output file: ${err.message}`);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.send(data);

      // Clean up the temporary and output files
      fs.unlink(outputFilePath, (err) => {
        if (err) {
          console.error(`Error deleting output file: ${err.message}`);
        }
      });
      fs.unlink(tempPath, (err) => {
        if (err) {
          console.error(`Error deleting temporary file: ${err.message}`);
        }
      });
    });
  });
}

// Start the server

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
