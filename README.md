# nikmedoed.github.io

This repository contains the source for my personal landing page and portfolio.
The site is generated with **Hugo** using Bulma for styling and a small dark/vivid palette.

Visit the site here: <https://nikmedoed.com>

Main page features:

- Short introduction with a link to my CV
- Grid of highlighted open source projects
- Brief about section
- Contact links and donation options

Project cards are defined in `data/projects.yaml`. Each entry lists the media file, description and technology tags used to generate a card via a reusable partial.

The `experience` page summarises my work history and links back to the main page.

To build the site locally run `hugo` and open `public/index.html`.

Feel free to explore the code or get in touch if you have questions!

## Contact form setup

The contact form on the main page expects a Google Apps Script endpoint to
process submissions. Create a new script at
<https://script.google.com> and deploy it as a web app using the following code:

```javascript
function doPost(e) {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getActiveSheet();
    sheet.appendRow([new Date(), data.email, data.subject, data.message]);
    MailApp.sendEmail({
        to: "your@email",
        replyTo: data.email,
        subject: data.subject,
        htmlBody: data.message
    });
    return ContentService.createTextOutput('OK');
}
```

### GitHub Pages Deployment

Disable GitHub’s default `pages-build-deployment` workflow to avoid duplicate builds. In **Settings → Pages**, set **Source** to **GitHub Actions** and select the Hugo workflow if one isn’t already present.
