// Fonction d'alerte et désactivation du formulaire
function formAlert(form, alertTitle = "Une erreur s'est produite.", alertDescription = "Veuillez rééssayer ultérieurement.", alertType = "error") {
  if (!form.querySelector('#formAlert')) {
    var formElements = form.querySelectorAll('fieldset, input, output, select, textarea, button');
    formElements.forEach(function (element) {
      element.disabled = true;
    });
    var alertDiv = document.createElement('div');
    alertDiv.id = 'formAlert';
    alertDiv.className = 'fr-alert fr-alert--' + alertType + ' fr-mb-4w';
    var title = document.createElement('h2');
    title.className = 'fr-alert__title';
    title.innerHTML = alertTitle;
    var description = document.createElement('p');
    description.innerHTML = alertDescription;
    alertDiv.appendChild(title);
    alertDiv.appendChild(description);
    if (document.getElementById(form.id + "-fieldset-messages")) {
      document.getElementById(form.id + "-fieldset-messages").appendChild(alertDiv);
    } else {
      form.insertBefore(alertDiv, form.firstChild);
    }
  }
}

// Fonction d'ajout de notice
function generateNotice(noticeTarget = document.querySelector('main'), noticeTitle = "Vos préférences ont bien été mises à jour.", noticeType = "success", noticeDesc = null) {
  if (noticeTarget.parentElement.querySelector('#mainNotice')) {
    noticeTarget.parentElement.querySelector('#mainNotice').remove();
  }
  const notice = document.createElement('div');
  notice.id = 'mainNotice';
  notice.className = 'fr-notice fr-notice--' + noticeType;
  var container = document.createElement('div');
  container.className = 'fr-container';
  var noticeBody = document.createElement('div');
  noticeBody.className = 'fr-notice__body';
  var noticeParagraph = document.createElement('p');
  var closeNotice = document.createElement('button');
  closeNotice.className = 'fr-btn--close fr-btn';
  closeNotice.title = 'Masquer le message';
  closeNotice.textContent = 'Masquer le message';
  closeNotice.onclick = function() {
    notice.remove();
  };
  var noticeTitleSpan = document.createElement('span');
  noticeTitleSpan.className = 'fr-notice__title';
  noticeTitleSpan.innerHTML = noticeTitle;
  noticeParagraph.appendChild(noticeTitleSpan);
  if (noticeDesc) {
    var noticeDescSpan = document.createElement("span");
    noticeDescSpan.className = "fr-notice__desc";
    noticeDescSpan.innerHTML = noticeDesc;
    noticeParagraph.appendChild(noticeDescSpan);
  }
  noticeBody.appendChild(noticeParagraph);
  noticeBody.appendChild(closeNotice);
  container.appendChild(noticeBody);
  notice.appendChild(container);

  noticeTarget.parentNode.insertBefore(notice, noticeTarget);
}

// Fonction de vérification de complétion d'un formulaire
function isFormComplete(form) {
  var requiredFields = form.querySelectorAll(':required');
  for (var i = 0; i < requiredFields.length; i++) {
    if (!requiredFields[i].checkValidity()) {
      return false;
    }
  }
  return true;
}

// Fonction pour activer/désactiver le bouton de soumission en fonction des champs requis et du captcha
function enableSubmitButton(form, enable = true) {
  var submitButton = form.querySelector('button[type="submit"]:not([data-fr-next-step="0"])');
  if (submitButton && (submitButton.disabled == enable) && submitButton.classList.contains("ademe-submit-to-enable")) {
    submitButton.disabled = !enable;
  } else if (submitButton  && !submitButton.classList.contains("ademe-submit-to-enable")) {
    submitButton.disabled = false;
  }
}
                                            
// Fonction de MAJ des champs du stepper lors des changements d'étapes
function updateStepper(stepper, step = 1) {
  var steps = stepper.parentElement.querySelectorAll('.fr-step');
  var totalSteps = steps.length;

  if (stepper.querySelector('.fr-stepper__title') && stepper.querySelector('.fr-stepper__steps') && stepper.querySelector('.fr-stepper__details') && totalSteps > 1) {
    // Mise à jour du titre
    var currentStepEl = Array.from(steps).find((stepEl) => stepEl.getAttribute('data-fr-step') == step);
    stepper.querySelector('.fr-stepper__title').innerHTML = currentStepEl.getAttribute('data-fr-step-title') + '<span class="fr-stepper__state">Étape ' + step + ' sur ' + totalSteps + '</span>';

    // Mise à jour de l'attribut 'data-fr-current-step'
    stepper.querySelector('.fr-stepper__steps').setAttribute('data-fr-current-step', step);

    // Mise à jour des détails de l'étape suivante
    var nextStepEl = Array.from(steps).find((stepEl) => stepEl.getAttribute('data-fr-step') == step + 1);
    if (nextStepEl) {
      stepper.querySelector('.fr-stepper__details').innerHTML = '<span class="fr-text--bold">Étape suivante :</span> ' + nextStepEl.getAttribute('data-fr-step-title');
    } else {
      stepper.querySelector('.fr-stepper__details').innerHTML = '';
    }

    // Affichage du step actuel et désactivation des champs de formulaire pour les étapes non actuelles
    steps.forEach(function (stepEl) {
      stepEl.style.display = 'none';
      var formFields = stepEl.querySelectorAll('fieldset:not([data-toggle="disabled"]), input:not([data-toggle="disabled"]), output:not([data-toggle="disabled"]), select:not([data-toggle="disabled"]), textarea:not([data-toggle="disabled"]), button:not([data-toggle="disabled"])');
      formFields.forEach(function (formField) {
        if (step == totalSteps) {
          formField.disabled = false; // Activer tous les champs à la dernière étape
        } else {
          formField.disabled = (stepEl !== currentStepEl); // Désactiver les champs des étapes non actuelles
        }
      });
    });
    currentStepEl.style.display = 'block';

    // Gestion des boutons
    if (step == totalSteps) {
      stepper.parentElement.querySelectorAll('button[type="button"]')[0].setAttribute('data-fr-next-step', step - 1);
      stepper.parentElement.querySelectorAll('button[type="button"]')[1].setAttribute('data-fr-next-step', 0);
      stepper.parentElement.querySelector('button[type="submit"]').setAttribute('data-fr-next-step', 1);
    } else {
      stepper.parentElement.querySelectorAll('button[type="button"]')[0].setAttribute('data-fr-next-step', step - 1);
      stepper.parentElement.querySelectorAll('button[type="button"]')[1].setAttribute('data-fr-next-step', step + 1);
      stepper.parentElement.querySelector('button[type="submit"]').setAttribute('data-fr-next-step', 0);
    }
    var inputs = currentStepEl.querySelectorAll('input, select, textarea, button');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].offsetParent != null) {
        inputs[i].focus();
        break;
      }
    }
  } else {
    stepper.innerHTML = '<h2 class="fr-stepper__title">Le composant "Indicateur d\'étapes" est incomplet. En tant que développeur, veuillez revoir le code HTML.</h2>'
  }
}

// Fonction pour formater le numéro de SIRET
function formatSiret(input) {
  let value = input.value.replace(/\s+/g, '');
  let formatted = '';
  for (let i = 0; i < value.length; i++) {
      if (i == 3 || i == 6 || i == 9) {
          formatted += ' ';
      }
      formatted += value[i];
  }
  input.value = formatted;
}

// Fonction pour limiter les entrées et le nombre de caractères
function isAllowedKey(event, input, maxLength, type = false, specialChars = []) {
  var charCode = (event.which) ? event.which : event.keyCode;
  var charStr = String.fromCharCode(charCode);
  if (type) {
    // Limite les entrées possibles
    var isAlpha = (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
    var isNum = charCode >= 48 && charCode <= 57;
    var isAlphaNum = isAlpha || isNum;
    var isSpecialChar = specialChars.some(char => char == charStr);
    if (type == 'alpha' && !isAlpha && !isSpecialChar) {
        return false;
    }
    if (type == 'num' && !isNum && !isSpecialChar) {
        return false;
    }
    if (type == 'alphanum' && !isAlphaNum && !isSpecialChar) {
        return false;
    }
  }
  // Limite la taille de l'input
  var isTextSelected = input.selectionStart != input.selectionEnd;
  if (!isTextSelected && input.value.replace(/\s+/g, '').length >= maxLength) {
      return false;
  }
  return true;
}
    
// Fonction pour activation/désactivation des "ademe-radio-group--input"
document.addEventListener('DOMContentLoaded', function () {
  const radioOtherInputGroups = document.querySelectorAll('.ademe-radio-group--input');
  radioOtherInputGroups.forEach(function(group) {
    const radioButton = group.querySelector('input[type="radio"]');
    const textInput = group.querySelector('input[type="text"]');
    radioButton.closest('form').addEventListener('change', function () {
      if (radioButton.checked) {
        textInput.disabled = false;
        if (radioButton.required) {
          textInput.setAttribute('required', 'required');
        }
      } else {
        textInput.disabled = true;
        textInput.removeAttribute('required');
      }
      enableSubmitButton(radioButton.closest('form'), isFormComplete(radioButton.closest('form')));
    });
  });
});
                                            
// Fonction de redirection 'onclick'
function jumpto(anchor){
  window.location.href = anchor;
}

// Fonction d'activation/désactivation de champs dynamique (focntionne avec les checkbox, radio-button, select & option
function handleToggle(toggleEl) {
  var toggleActions = Object.keys(toggleEl.dataset)
    .filter(key => key.startsWith('toggle')) // Trouve toutes les clés commençant par 'toggle'
    .map(key => ({ toggleAction: key.replace('toggle', '').toLowerCase(), toggleIds: toggleEl.dataset[key] })); // Récupère les actions
  var isChecked = toggleEl.checked || (((toggleEl.tagName == 'INPUT' && toggleEl.type != 'checkbox') || toggleEl.tagName == 'SELECT') && toggleEl.value && toggleEl.checkValidity()) || (toggleEl.tagName == 'OPTION' && toggleEl.selected);

  toggleActions.forEach(function ({ toggleAction, toggleIds }) {
    if (toggleIds) {
      toggleIds.split(' ').forEach(function (toggleId) {
        var targetElement = document.getElementById(toggleId);
        if (targetElement) {
          var parent = targetElement.closest('.fr-fieldset__element');

          // Vérifie si tous les éléments décléchencheurs sont off
          var allOff = true;
          if (['show', 'hide', 'enable', 'disable', 'require', 'option', 'active', 'readonly'].includes(toggleAction)) {
            Array.from(document.querySelectorAll("[data-toggle-" + toggleAction + "]")).forEach(function(sameToggle) {
              var sameToggleAttr = sameToggle.getAttribute("data-toggle-" + toggleAction);
              if (sameToggleAttr && sameToggleAttr.split(' ').includes(toggleId) && sameToggle != toggleEl && (sameToggle.checked || (sameToggle.tagName === 'OPTION' && sameToggle.selected) || (sameToggle.tagName === 'SELECT' && sameToggle.checkValidity()))) {
                allOff = false;
              }
            });
          }
          
          if (isChecked || allOff) {
            switch (toggleAction) {
              case 'show':
                if (parent) parent.style.display = isChecked ? 'block' : 'none';
                targetElement.disabled = !isChecked;
                targetElement.setAttribute('data-toggle', isChecked ? 'enabled' : 'disabled');
                break;
              case 'hide':
                if (parent) parent.style.display = isChecked ? 'none' : 'block';
                targetElement.disabled = isChecked;
                targetElement.setAttribute('data-toggle', isChecked ? 'disabled' : 'enabled');
                break;
              case 'enable':
                targetElement.disabled = !isChecked;
                targetElement.setAttribute('data-toggle', isChecked ? 'enabled' : 'disabled');
                break;
              case 'disable':
                targetElement.disabled = isChecked;
                targetElement.setAttribute('data-toggle', isChecked ? 'disabled' : 'enabled');
                break;
              case 'require':
                targetElement.required = isChecked;
                document.querySelector("label[for=" + targetElement.id + "] .ademe-hint-text--inline").style.display = isChecked ? 'none' : 'inline';
                break;
              case 'option':
                targetElement.required = !isChecked;
                document.querySelector("label[for=" + targetElement.id + "] .ademe-hint-text--inline").style.display = isChecked ? 'inline' : 'none';
                break;
              case 'active':
                targetElement.readOnly = !isChecked;
                break;
              case 'readonly':
                targetElement.readOnly = isChecked;
                break;
              case 'default':
                /* script ici pour gérer le toggle avec une checkbox validée au minimum */
                var defaultGroup = toggleEl.getAttribute('data-toggle-default');
                var groupCheckboxes = document.querySelectorAll('[data-toggle-default="' + defaultGroup + '"]');
                var anyChecked = Array.from(groupCheckboxes).some(function(checkbox) {
                  return checkbox.checked && checkbox !== targetElement;
                });
                if (!anyChecked) {
                  targetElement.checked = true;
                  targetElement.readOnly = true;
                } else {
                  targetElement.readOnly = false;
                }
                break;
              case 'linked':
                targetElement.checked = isChecked;
                break;
              default:
                break;
            }
          }
        }
      });
    }
  });
}
      
// Fonction de remplissage automatique de champs adresse avec données data-attributes
function fillFields(fromLi, dataPrefix = "") {
  var fields = {};
  var regex = new RegExp("^" + dataPrefix + "(.+)$");
  for (var key in fromLi.dataset) {
    // la propriété .dataset retourne les data-attributes HTML en camelCase, sans le préfixe 'data-' (exemple: 'data-address-street' devient 'addressStreet')
    if (fromLi.dataset[key] != undefined) {
      var match = key.match(regex);
      if (match) {
        var fieldId = match[1].toLowerCase();
        fields[fieldId] = fromLi.dataset[key];
      }
    }
  }
  // Pour chaque attribut défini, on rempli le champ correspondant dans le formulaire
  for (var key in fields) {
    var field = document.getElementById(key);
    if (field) {
      field.value = fields[key];
    }
  }
}

// Fonction d'appel à l'API Adresse Data Gouv et remplissage de la liste d'options
function fetchAPIAddressDataGouv(query, returnList) {
  var url = "https://api-adresse.data.gouv.fr/search/?q=" + encodeURIComponent(query) + "&limit=10&autocomplete=1";
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (returnList) {
        var listEl = document.createElement("ul");
        listEl.className = "ademe-address-list";
        data.features.forEach(function (feature) {
          var listItem = document.createElement("li");
          listItem.className = "ademe-address-item";
          var street = feature.properties.name;
          var postalcode = feature.properties.postcode || feature.properties.context.split(", ")[0].padEnd(5, '0');
          var city = feature.properties.city;
          var department = feature.properties.context.split(", ")[1];
          var region = feature.properties.context.split(", ")[2] || department;
          listItem.innerHTML = street + " <b>" + postalcode + ", " + city + ", " + region + "</b>";
          listItem.setAttribute("data-address-street", street);
          listItem.setAttribute("data-address-postalcode", postalcode);
          listItem.setAttribute("data-address-city", city);
          listItem.setAttribute("data-address-department", department);
          listItem.setAttribute("data-address-region", region);
          listItem.setAttribute("data-address-country", "France");

          listItem.addEventListener("mousedown", function () {
            fillFields(listItem, "address");
            returnList.innerHTML = "";
          });
          
          listEl.appendChild(listItem);
        });
        returnList.appendChild(listEl);
      } else {
        console.log(JSON.stringify(data));
      }
    })
    .catch(function (error) {
      console.error("Erreur lors de la récupération des adresses :", error);
    });
}

// Fonction pour récupérer des infos depuis le payload d'un JWT
function getClaimFromJWT(jwt, claimPath) {
  var payload = jwt.split('.')[1];
  while (payload.length % 4 !== 0) {
    payload += '=';
  }
  var payload = JSON.parse(atobUTF8(payload));
  var keys = claimPath.split('.');
  for (var i = 0; i < keys.length; i++) {
    payload = payload[keys[i]];
    if (payload === undefined) {
      return undefined;
    }
  }
  return payload;
}

// Fonction pour décoder une chaîne Base64 en UTF-8 sans problème de caractères
function atobUTF8(base64) {
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  const binaryString = atob(base64.replace('-', '+').replace('_', '/'));
  const bytes = Uint8Array.from(binaryString, (m) => m.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// Actions après le chargement du contenue de la page
document.addEventListener('DOMContentLoaded', function () {
    
  // Soumission d'un formulaire
  const forms = document.querySelectorAll('form');
  forms.forEach(function (form) {
    // AFfichage forcé des messages principaux (fix CSS)
    var mainFormMessages = document.getElementById(form.id + "-fieldset-messages")
    if (mainFormMessages) {
      mainFormMessages.classList.add('fr-messages--main');
    }
    // Détection du submit button désactivé par défaut
    if (form.querySelector('button[type="submit"]') && form.querySelector('button[type="submit"]').disabled == true) {
      form.querySelector('button[type="submit"]').classList.add('ademe-submit-to-enable');
    }
    // Activation du submit button si tous les champs requis sont remplis
    form.querySelectorAll(':required').forEach(function (input) {
      input.addEventListener('input', function () {
        if (form.querySelector('#li-antibot')) {
          if (!form.querySelector('#li-antibot-iframe') && isFormComplete(form) && form.querySelector('button[type="submit"]').getAttribute("data-fr-next-step") != 0) {
            form.querySelector('button[type="submit"]').disabled = true;
            captchaLoadOnce();
          } else if (form.dataset.captcha == "verified") {
            enableSubmitButton(form, isFormComplete(form));
          }
        } else {
          enableSubmitButton(form, isFormComplete(form));
        }
        // Reinitialisation de la validité de l'input si erreur de validation serveur
        if (input.classList.contains("server-validation")) {
          input.setCustomValidity("");
          form.classList.remove('server-validation');
        }
      });
    });
    // Traitement données formulaire page externe
    form.addEventListener('submit', function (event) {
      event.preventDefault(); // Empêche le comportement de soumission du formulaire par défaut
      if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('needs-validation');
      } else {
        mainFormMessages.innerHTML = "";
        var submitter = form.querySelector('button[type="submit"]');
        submitter.disabled = true;
        form.classList.remove('needs-validation');
        var formData = new FormData(form, submitter);
        fetch(form.action, {
          method: form.method,
          body: formData
        })
          .then(function (response) {
            // Réponse du serveur ici
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Une erreur du serveur inconnue s'est produite !");
            }
          })
          .then(function (data) {
            if (data.success) {
              if (data.type == "redirect") {
                // Redirection après enregistrement des données
                window.location.href = data.msg;
              } else if (typeof customFormSuccess == 'function') {
                // Action personalisée à définir dans une fonction customFormSuccess()
                customFormSuccess(form, data);
              } else {
                formAlert(form, "Votre demande a bien été prise en compte.", "Merci et à bientôt.", "success");
              }
            } else if (typeof customFormError == 'function') {
              // Action personalisée à définir dans une fonction customFormError()
              customFormError(form, data);
            } else if (data.type == "create" || data.type == "update" || data.type == "permission" || data.type == "server") {
              // Erreur d'enregistrement des données
              formAlert(form);
              if (data.type != "permission" && data.type != "server") {
                submitter.disabled = false; // ! Vérifier ça pour formulire externe avec stepper
              }
            } else {
              // Champs invalide côté serveur
              // Affiche le message d'erreur sous le fieldset
              var errorMsg = document.createElement("p");
              errorMsg.className = "fr-message fr-message--error";
              errorMsg.textContent = data.msg;
              document.getElementById(form.id + "-fieldset-messages").appendChild(errorMsg);
              // Affiche le champ concerné en rouge
              form.classList.add('needs-validation');
              var inputField = form.querySelector('[name="' + data.type + '"]');
              if (inputField) {
                inputField.required = true;
                inputField.setCustomValidity(data.msg);
                inputField.classList.add('server-validation');
                if (inputField.closest(".fr-step")) {
                  updateStepper(form.closest(".fr-container").querySelector(".fr-stepper"), parseInt(inputField.closest(".fr-step").getAttribute("data-fr-step")));
                }
              } else {
                console.log("le champ '" + data.type + "' est introuvable.");
              }
              submitter.disabled = false;
            }
          })
          .catch(function (error) {
            console.error(error);
            if (typeof customFormError == 'function') {
              // Action personalisée à définir dans une fonction customFormError()
              customFormError(form, error);
            } else {
              formAlert(form);
            }
          });
      }
    });
  });
    
  // Gestion des éléments checkbox, radio et options avec data-toggle-*
  var toggleSelectors = 'input[type="text"][data-toggle-show], input[type="text"][data-toggle-hide], input[type="text"][data-toggle-enable], input[type="text"][data-toggle-disable], input[type="text"][data-toggle-require], input[type="text"][data-toggle-option], input[type="text"][data-toggle-active], input[type="text"][data-toggle-readonly], input[type="text"][data-toggle-default], input[type="text"][data-toggle-linked], input[type="checkbox"][data-toggle-show], input[type="checkbox"][data-toggle-hide], input[type="checkbox"][data-toggle-enable], input[type="checkbox"][data-toggle-disable], input[type="checkbox"][data-toggle-require], input[type="checkbox"][data-toggle-option], input[type="checkbox"][data-toggle-active], input[type="checkbox"][data-toggle-readonly], input[type="checkbox"][data-toggle-default], input[type="checkbox"][data-toggle-linked], input[type="radio"][data-toggle-show], input[type="radio"][data-toggle-hide], input[type="radio"][data-toggle-enable], input[type="radio"][data-toggle-disable], input[type="radio"][data-toggle-require], input[type="radio"][data-toggle-option], input[type="radio"][data-toggle-active], input[type="radio"][data-toggle-readonly], select[data-toggle-show], select[data-toggle-hide], select[data-toggle-enable], select[data-toggle-disable], select[data-toggle-require], select[data-toggle-option], select[data-toggle-active], select[data-toggle-readonly], option[data-toggle-show], option[data-toggle-hide], option[data-toggle-enable], option[data-toggle-disable], option[data-toggle-require], option[data-toggle-option], option[data-toggle-active], option[data-toggle-readonly]';
  document.querySelectorAll(toggleSelectors).forEach(function (element) {
    // Appeler handleToggle pour l'état initial
    handleToggle(element);
    // Ajouter un écouteur d'événements
    if (element.tagName == 'OPTION') {
      if (element.closest('select')) {
        element.closest('select').addEventListener('change', function () {
          handleToggle(element);
        });
      }
    } else {
      element.addEventListener('change', function () {
        handleToggle(element);
      });
    }
  });
  // Désactivation d'une checkbox avec attribut readonly
  document.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
    ['click', 'change'].forEach(function(eventType) {
      checkbox.addEventListener(eventType, function(event) {
        if (checkbox.readOnly) {
          event.preventDefault();
        }
      });
    });
  });
  
  // Gestion du composant "Indicateur d'étapes"
  var steppers = document.querySelectorAll('.fr-stepper');
  steppers.forEach(function (stepper) {
    var steps = stepper.parentElement.querySelectorAll('.fr-step');
    var totalSteps = steps.length;
    // Mise à jour de l'attribut 'data-fr-steps' avec la valeur de N
    if (stepper.querySelector('.fr-stepper__steps') && totalSteps > 0) {
      stepper.querySelector('.fr-stepper__steps').setAttribute('data-fr-current-step', 1);
      stepper.querySelector('.fr-stepper__steps').setAttribute('data-fr-steps', totalSteps);
    }
    // Mise à jour de l'attribut 'data-fr-step' de chaque step
    steps.forEach(function (step, index) {
      step.setAttribute('data-fr-step', index + 1);
    });
    // Appel de la fonction updateStepper au démarrage de la page
    updateStepper(stepper);
    // Appel de la fonction updateStepper au clic des boutons
    stepper.parentElement.querySelectorAll('button[type="button"][data-fr-next-step]').forEach(function (stepBtn) {
      stepBtn.addEventListener('click', function () {
        var nextStep = parseInt(stepBtn.getAttribute('data-fr-next-step'));
        var currentStep = parseInt(stepper.querySelector('.fr-stepper__steps').getAttribute('data-fr-current-step'));
        if (nextStep != 0) {
          var form = stepper.parentElement.querySelector('form');
          if (nextStep > currentStep && form && !form.checkValidity()) {
            form.classList.add('needs-validation');
          } else {
            updateStepper(stepper, nextStep);
            if (form) {
              form.classList.remove('needs-validation');
            }
          }
        }
      });
    });
  });

  // Detection et gestion des list d'adresse avec autocompletion via API Adresse Data Gouv
  document.querySelectorAll('[data-address-autocomplete]').forEach(function (element) {
    var autocompleteInput = document.getElementById(element.getAttribute('data-address-autocomplete'));
    var countryInput = document.getElementById('country') || document.querySelector('select[name="country"]');
    var timeout = null;
    var selectedIndex = -1;
    if (autocompleteInput) {
      // Détection du remplissage du champ pour déclenchement de l'API Adresse Data Gouv
      autocompleteInput.addEventListener("input", function () {
        clearTimeout(timeout);
        element.innerHTML = "";
        selectedIndex = -1;
        if (autocompleteInput.value.length >= 5) {
          timeout = setTimeout(function () {
            var countryValue = countryInput ? countryInput.value : "";
            if (countryValue == "" || countryValue.toLowerCase() == "france") {
              fetchAPIAddressDataGouv(autocompleteInput.value, element);
            }
          }, 500);
        }
      });
      // Selection des options avec les touches Haut/Bas et validation avec Entrer
      autocompleteInput.addEventListener("keydown", function (e) {
        var listEl = element.querySelector(".ademe-address-list");
        if (listEl) {
          var listItems = listEl.querySelectorAll(".ademe-address-item");
          if (listItems.length > 0) {
            if (e.key == "ArrowDown") {
              e.preventDefault();
              selectedIndex = Math.min(selectedIndex + 1, listItems.length - 1);
              listItems.forEach(item => item.classList.remove('focused'));
              listItems[selectedIndex].classList.add('focused');
            } else if (e.key == "ArrowUp") {
              e.preventDefault();
              selectedIndex = Math.max(selectedIndex - 1, 0);
              listItems.forEach(item => item.classList.remove('focused'));
              listItems[selectedIndex].classList.add('focused');
            } else if (e.key == "Enter") {
              e.preventDefault();
              fillFields(listItems[selectedIndex], "address");
              element.innerHTML = "";
            }
          }
        }
      });
    }
  });

  // Affichage des départements associé uniquement à la région source du fourmulaire dans le select/option
  const regionSelect = document.querySelector('[data-select-region]');
  if (regionSelect) {
    const regionSelectValue = regionSelect.getAttribute('data-select-region');
    const departementOptions = regionSelect.querySelectorAll('[data-option-region]');
    if (regionSelectValue && regionSelectValue != '') {
      departementOptions.forEach(option => {
        var departementOptionValue = option.getAttribute('data-option-region');
        if (departementOptionValue != regionSelectValue) {
          option.remove();
        }
      });
    }
  }
  
});



