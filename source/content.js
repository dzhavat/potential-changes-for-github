"use strict";

function escapeHTML(input) { 
  return input
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function init() {
  let fileActions = document.querySelector(".Box-header.d-flex .BtnGroup");

  if (!isSingleFile() || !fileActions) {
    return;
  }

  let wrapper = document.querySelector(".potential-changes");

  if (!!wrapper) {
    wrapper.remove();
  }

  wrapper = document.createElement('div');
  wrapper.className = 'potential-changes';

  let button = document.createElement("button");
  button.type = "button";
  button.className = "potential-changes__button";
  button.textContent = "Potential changes";

  let dropdown = document.createElement('div');
  dropdown.className = 'potential-changes__dropdown';

  wrapper.append(button, dropdown);

  fileActions.prepend(wrapper);

  button.addEventListener("click", function(event) {
    if (dropdown.classList.contains('potential-changes__dropdown--visible')) {
      dropdown.classList.toggle('potential-changes__dropdown--visible');

      return;
    }

    dropdown.innerHTML = '';
    dropdown.classList.toggle('potential-changes__dropdown--visible');

    if (isPrivate()) {
      return showPrivateMessage(dropdown);
    }

    const numberOfPRs = getNumberOfPRs();

    if (numberOfPRs === 0) {
      return showNoPRsMessage(dropdown);
    } else if (numberOfPRs > 10) {
      return showTooManyPRsMessage(dropdown, numberOfPRs);
    }

    checkForPotentialChanges(dropdown);
  });
}

function showPrivateMessage(dropdownElement) {
  dropdownElement.innerHTML = `
    <p>This repository appears to be <i>Private</i>.</p>
    <p>Requesting PRs of private repositories <strong>requires an access token</strong>.
    Because of that, this extension is currently limited to <i>Public</i> repositories only.</p>
    <p>If you are interested in knowing more, check out the progress of this feature on 
    its <a href="https://github.com/dzhavat/potential-changes" target="_blank">repo</a>.</p>
  `;
}

function showTooManyPRsMessage(dropdownElement, numberOfPRs) {
  dropdownElement.innerHTML = `
    <p>There are <strong>${numberOfPRs}</strong> PRs in this repository. Requesting all of them at once can cause performance issues on your browser.</p>
    <p>Because of this and due to the fact that this extension is in an early <strong><i>alpha</i></strong> release, it is currently limited to repositories with less than 10 PRs.</p>
    <p>If you are interested in knowing more, check out the progress of this feature on 
    its <a href="https://github.com/dzhavat/potential-changes" target="_blank">repo</a>.</p>
  `;
}

function isSingleFile() {
  return /\/blob\//.test(location.pathname);
}

function isButtonPresent() {
  return !!document.querySelector(".potential-changes__button");
}

function showNoPRsMessage(dropdownElement) {
  dropdownElement.innerHTML = `
    <p>There are no pull requests in this repository.</p>
    <p>That means there are no changes related to this file.</p>
  `;
}

function showNoMatchingPRs(dropdownElement) {
  dropdownElement.innerHTML = `
    <p>There are no pull requests that contain changes related to this file.</p>
  `;
}

function checkForPotentialChanges(dropdownElement) {
  dropdownElement.innerHTML = '<p>Analyzing pull requests...</p>';

  const fileToMatch = location.pathname
    .split("/")
    .slice(5)
    .join("/");
  const matchingPRs = [];
  let listOfPRs = [];

  getPRs()
    .then(PRs => {
      listOfPRs = PRs;

      return Promise.all(
        PRs
          .map(pr => {
            return fetch(`${pr.url}/files`)
              .then(response => response.json())
          })
      )
    })
    .then(responses => {
      responses.forEach((files, index) => {
        files.forEach(file => {
          if (file.filename == fileToMatch) {
            matchingPRs.push(listOfPRs[index]);
          }
        });
      });

      if (matchingPRs.length === 0) {
        return showNoMatchingPRs(dropdownElement);
      }

      return showMatchingPRs(dropdownElement, matchingPRs);
    })
    .catch(error => {
      dropdownElement.innerHTML = `
        <p>There was a problem when trying to get the list of pull requests.</p>
        <p>Error: ${escapeHTML(error.message)}.</p>
      `;
    });
}

function showMatchingPRs(dropdownElement, matchingPRs) {
  const ul = document.createElement('ul');
  ul.className = 'potential-changes__prs-list';

  matchingPRs.forEach(pr => {
    const listItem = document.createElement("li");
    listItem.className = 'potential-changes__prs-list-item';

    const link = document.createElement("a");
    link.setAttribute("href", pr.html_url);
    link.setAttribute("target", "_blank");
    link.textContent = pr.title;

    listItem.appendChild(link);

    ul.appendChild(listItem);
  });

  dropdownElement.innerHTML = '';

  let p = document.createElement('p');

  if (matchingPRs.length === 1) {
    p.textContent = 'One pull request contains changes related to this file:';
  } else {
    p.textContent = `${matchingPRs.length} pull requests contain changes related to this file:`;
  }

  dropdownElement.append(p, ul);
}

function getPRs() {
  const [owner, repo] = location.pathname.split("/").slice(1, 3);
  const fileToMatch = location.pathname
    .split("/")
    .slice(5)
    .join("/");
    
  if (!fileToMatch) {
    return Promise.reject({ message: "No file to match." });
  }

  const endpoint = `https://api.github.com/repos/${owner}/${repo}/pulls`;

  return fetch(endpoint).then(response => response.json());
}

function getNumberOfPRs() {
  let prs = 0;
  const counterElem = document.querySelector('nav.js-repo-nav > span:nth-child(3) span.Counter');

  if (!counterElem) {
    return prs;
  }

  try {
    prs = parseInt(counterElem.textContent.replace(',', ''), 10);
  } catch (e) {}

  return prs;
}

function isPrivate() {
  return !!document.querySelector('.pagehead h1.private');
}

document.addEventListener('pjax:end', init);

init();
