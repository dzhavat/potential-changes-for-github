# Potential changes for GitHub

Browser extension that shows which pull requests contain changes related to a file.

## Install

* [Chrome extension](https://chrome.google.com/webstore/detail/potential-changes-for-git/neehipoljbecacjcgcceflmlikiadkob)
* [Firefox addon](https://addons.mozilla.org/en-US/firefox/addon/potential-changes-for-github/)

## Limitations

**Note**: This extension is still a **proof of concept** and as such has the following limitations:

- It is limited to Public repositories only.
- It is limited to repositories with 10 or less pull requests.
- GitHub has a rate limit of 60 requests per hour. Usually same requests are cached but if you want to check multiple files in different repositories, you can quickly "run out" of requests.

Most of the limitations above are there only because I wanted to save time and focused on solving the core idea behind the extension.

## Demo 

![Demo](demo.gif)

## Running locally

### Chrome

1. Go to `chrome://extensions/` page.
2. Toggle “Developer mode” in the upper right corner.
3. Click the “Load unpacked” button.
4. Select the `source` directory.

### Firefox

1. Open the `source` directory.
2. Make an archive containing all files within the directory.
3. Open Firefox and go to `about:debugging#/runtime/this-firefox` page.
4. Click the “Load Temporary Add-on...” button.
5. Select the archive created on step 1.

## Contributions

You're more than welcome to contribute. There are several things you can do:

* Report bugs.
* Submit a pull request to one of the [issues](https://github.com/dzhavat/potential-changes-for-github/issues).
* Review pull requests.
* Suggest new ideas.
* Suggest improvements to the code.
* Port the extension to another browser.

Thank you!