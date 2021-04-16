import "regenerator-runtime/runtime";

const formsIds = ['overview-form', 'solutions-form', 'service-form', 'faq-form', 'video-form', 'news-form','event-form'];


const pleaseWaitText = "Please Wait while we fetch translation...";
const editorData = {};
let currentLanguage = "DE";

const tryAgainText = "Try Again";

// To validate Email
const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);

const validLinkRegex = RegExp(
  /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
);

// Weglot Code
if (Weglot) {
  Weglot.on("initialized", () => {
    activateWeglot();
  });
  Weglot.on("languageChanged", () => {
    activateWeglot();
  });
} else {
  initializeForms();
}

function activateWeglot() {
  currentLanguage = Weglot?.getCurrentLang()?.toUpperCase();
  initializeForms();
}

// Editor Code
const icons = Quill.import("ui/icons");
for (let i = 2; i <= 6; i += 1) {
  icons.header[i] = `<b>H${i}</b>`;
}

$(".editor").each(function (idx) {
  $(this).data("editor-id", `editor${idx}`);
  var quill = new Quill(this, {
    modules: {
      toolbar: [
        ["bold", "italic"],
        [
          { header: 2 },
          { header: 3 },
          { header: 4 },
          { header: 5 },
          { header: 6 },
        ],
        ["link", "blockquote", "video"],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
    },
    placeholder: "Compose an epic...",
    theme: "snow",
  });

  editorData[`editor${idx}`] = quill;

  var $form = $(this).closest("form");
  $form.submit(() => {
    // Populate hidden form on submit
    var $about = $(this).siblings("textarea.editor-data");
    $about.text(quill.root.innerHTML);
  });
});

function initializeForms() {
  // Form Code
  formsIds.forEach((echId) => {
    const $form = $(`#${echId}`);
    if ($form) {
      initApp($form);
    }
  });
}

$("#update-item").show();

function initApp(parentEle) {
  const $form = $(parentEle);
  const otherLangInputs = [];
  const currLangInputs = [];
  let formErrors = {};

  if (!$form) {
    console.log("No Parent Found");
    return;
  }

  const customValidationInputsArr = $($form).find("[data-custom-validation]");

  const $submitBtn = $($form).find("[data-form-submit]");

  $form.on("keyup change", validateFormHandler);
  $submitBtn.click(handleSubmit);

  getCustomValidationInputs($form);

  $($form)
    .find("[data-type-lang]")
    .each(function () {
      if ($(this).data("type-lang") !== currentLanguage) {
        $(this).slideUp();
        const innerInputs = $(this).find("[data-input-type]");
        otherLangInputs.push(innerInputs);
      } else {
        $(this).slideDown();
        const innerInputs = $(this).find("[data-input-type]");
        currLangInputs.push(innerInputs);
        hideTranslateBtn($($form).find("[data-translate-btn]"));
        getAndLoopInputs(this);
        addOnChangeELToInput(this);
      }
    });

  $($form)
    .find("[data-translate-btn]")
    .click(function () {
      const eleToShow = $(this).data("translate-btn");
      if (Boolean($(this).data("isOn"))) {
        $(this).data("isOn", "");
        $($form)
          .find(`[data-input-type=${eleToShow}]`)
          .parent()
          .not(`[data-type-lang=${currentLanguage}]`)
          .slideUp();
      } else {
        $(this).data("isOn", "true");

        $($form)
          .find(`[data-input-type=${eleToShow}]`)
          .parent()
          .not(`[data-type-lang=${currentLanguage}]`)
          .slideDown();

        const eleInCurrLang = $($form)
          .find(`[data-type-lang=${currentLanguage}]`)
          .children(`[data-input-type=${eleToShow}]`);

        const eleInOtherLang = $($form)
          .find(`[data-type-lang]`)
          .not(`[data-type-lang=${currentLanguage}]`)
          .children(`[data-input-type=${eleToShow}]`);

        handleTranslation(eleInCurrLang, eleInOtherLang).then((data) => {
          console.log("done Translating");
        });
      }
    });

  function getCustomValidationInputs(formEle) {
    if (!formEle) return;
    $(formEle)
      .find("[data-custom-validation]")
      .each(function () {
        addInputChangeEL(this);
      });
  }

  // check if editor is empty
  function checkIfEditorIsEmpty(domEle) {
    if (!domEle) return;
    return getEditorObj(domEle).getText().length > 1 ? false : true;
  }

  function getEditorObj(ele) {
    if (Object.keys(editorData).length === 0) return;
    const currEleEditorId = $(ele).data("editor-id");
    if (!currEleEditorId) return;
    const currEleQuillObj = editorData[currEleEditorId];
    return currEleQuillObj;
  }

  //get input by data-input-type
  function getAndLoopInputs(parentEle) {
    if (!parentEle) return;
    const innerInput = $(parentEle).find("[data-input-type]");
    if ($(innerInput).is("div")) return;
    addRequiredProp(innerInput);
  }

  // Set required to inputs dynamically
  function addRequiredProp(domEle) {
    if (!domEle) return;
    $(domEle).prop("required", true);
  }

  // Add EventListeners to input
  function addOnChangeELToInput(domEle) {
    let innerInput = $(domEle).find("[data-input-type]");
    const typeOfInput = $(innerInput).data("input-type");

    if ($(innerInput).is("div")) {
      const editorObj = getEditorObj(innerInput);
      editorObj.on("text-change", function (delta, oldDelta, source) {
        if (editorObj.getText().length > 1) {
          showTranslateBtn(
            $(domEle).siblings().children(`[data-translate-btn=${typeOfInput}]`)
          );
        } else {
          hideTranslateBtn(
            $(domEle).siblings().children(`[data-translate-btn=${typeOfInput}]`)
          );
        }
      });
    } else {
      $(innerInput).on("change keyup paste", function (e) {
        if ($(innerInput).val().length > 0) {
          showTranslateBtn(
            $(domEle).siblings().children(`[data-translate-btn=${typeOfInput}]`)
          );
        } else {
          hideTranslateBtn(
            $(domEle).siblings().children(`[data-translate-btn=${typeOfInput}]`)
          );
        }
      });
    }
  }

  // show hide translate btns
  function hideTranslateBtn(arrOfEle) {
    $(arrOfEle).parent("div").slideUp().data("isHidden", true);
  }

  function showTranslateBtn(ele) {
    if ($(ele).parent("div").data("isHidden")) {
      $(ele).parent("div").slideDown().data("isHidden", false);
    }
    return;
  }

  // check if input is empty
  function checkIfInputIsEmpty(ele) {
    if (!ele) return;
    return $(ele).val().length > 0 ? false : true;
  }

  function testIfAllInputsAreValidate() {
    $(customValidationInputsArr).each(function () {
      checkForFormErrors(null, this);
    });
  }

  // if empty -> get translation -> add it to form inputs
  async function handleSubmit(e) {
    $(e.target).text(pleaseWaitText);
    testIfAllInputsAreValidate();
    validateFormHandler();

    // handle translations
    const resData = await Promise.all(
      otherLangInputs.map(async (echInput, idx) => {
        if (
          (isItAEditor(echInput) && checkIfEditorIsEmpty(echInput)) ||
          (!isItAEditor(echInput) && checkIfInputIsEmpty($(echInput)))
        ) {
          return await handleTranslation(currLangInputs[idx], echInput);
        }
      })
    );

    console.log("done", resData);
    if (validateForm(formErrors)) {
      $form.submit();
    } else {
      $(e.target).text(tryAgainText);
    }
  }

  function isItAEditor(ele) {
    if (!ele) return null;
    return $(ele).is("div") ? true : false;
  }

  async function handleTranslation(currEleWithText, toAddTranslationEle) {
    try {
      const langToTranslate = $(toAddTranslationEle)
        .parent("[data-type-lang]")
        .data("type-lang");
      const sourceLang = $(currEleWithText)
        .parent("[data-type-lang]")
        .data("type-lang");

      console.log({ langToTranslate, sourceLang });

      if (isItAEditor(currEleWithText)) {
        const toTransEleQuillObj = getEditorObj(toAddTranslationEle);
        toTransEleQuillObj.setText(pleaseWaitText);
        const textToTranslate = getEditorObj(currEleWithText).getText();
        console.log({ textToTranslate });
        const [text] = await getTranslation(
          textToTranslate,
          langToTranslate,
          sourceLang
        );
        toTransEleQuillObj.setText(text);
        return text;
      } else {
        $(toAddTranslationEle).val(pleaseWaitText);
        const textValueOfCurrLang = $(currEleWithText).val();
        const [text] = await getTranslation(
          textValueOfCurrLang,
          langToTranslate,
          sourceLang
        );
        $(toAddTranslationEle).val(text);
        return text;
      }
    } catch (error) {
      console.log({ error });
      return "";
    }
  }

  async function getTranslation(text, lang, sourceLang = "") {
    try {
      console.log({ text, lang });
      if (!text) return;
      text = encodeURIComponent(text);
      const arrOfText = [{ text, lang, sourceLang }];
      const resData = await fetch('https://deepl-translate-app.herokuapp.com/translate', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ arrOfText }),
      });
      const { translatedTextArr } = await resData.json();
      console.log({ translatedTextArr });
      return translatedTextArr;
    } catch (error) {
      console.log({ error });
      return [""];
    }
  }

  function addInputChangeEL(inputEle) {
    if (!inputEle) return;
    $(inputEle).on("keyup change", checkForFormErrors);
    const inputDataName = $(inputEle).attr("name");
    let inputName = $(inputEle).data("dy-val");
    if (!inputName) {
      inputName = `${inputDataName + Math.floor(Math.random() * 10)}`;
      $(inputEle).data("dy-val", inputName);
    }
    if (!formErrors[inputName]) {
      formErrors[inputName] = "";
    }
  }

  function getInputValidationType(domEle) {
    let typeOfValidation = {};
    if ($(domEle).data("validate-link")) {
      typeOfValidation["dataName"] = "link";
      typeOfValidation["dataValue"] = $(domEle).data("validate-link");
    } else if ($(domEle).data("validate-number")) {
      typeOfValidation["dataName"] = "number";
      typeOfValidation["dataValue"] = $(domEle).data("validate-number");
    } else if ($(domEle).data("validate-email")) {
      typeOfValidation["dataName"] = "email";
      typeOfValidation["dataValue"] = $(domEle).data("validate-email");
    } else if ($(domEle).data("validate-name")) {
      typeOfValidation["dataName"] = "name";
      typeOfValidation["dataValue"] = $(domEle).data("validate-name");
    } else if ($(domEle).data("validate-select")) {
      typeOfValidation["dataName"] = "select";
      typeOfValidation["dataValue"] = $(domEle).data("validate-select");
    }
    return typeOfValidation;
  }

  function checkForFormErrors(e, ele) {
    let name;
    let value;
    let toValidateType;
    let toValidateTypeValue;
    let isRequired = false;

    if (ele) {
      name = $(ele).data("dy-val");
      value = $(ele).val();
      const { dataName, dataValue } = getInputValidationType(ele);
      toValidateType = dataName;
      toValidateTypeValue = dataValue;
      isRequired = $(ele).data("is-required");
    } else {
      name = $(e.target).data("dy-val");
      value = e.target.value;
      const { dataName, dataValue } = getInputValidationType(e.target);
      toValidateType = dataName;
      toValidateTypeValue = dataValue;
      isRequired = $(e.target).data("is-required");
    }

    let errors = { ...formErrors };
    switch (toValidateType) {
      case "email":
        errors[name] = validateEmail(value, isRequired);
        break;
      case "name":
        errors[name] = validateName(value, toValidateTypeValue, isRequired);
        break;
      case "link":
        errors[name] = validateLink(value, toValidateTypeValue, isRequired);
        break;
      case "number":
        errors[name] = validateNumber(value, toValidateTypeValue, isRequired);
        break;
      case "select":
        errors[name] = validateDropDown(value, toValidateTypeValue, isRequired);
        break;
      default:
        break;
    }
    updateFormErrors(errors);
  }

  function updateFormErrors(errors) {
    formErrors = { ...formErrors, ...errors };
    Object.keys(formErrors).forEach((echErr) => {
      const eleToSelect = getElementByDyVal(echErr);
      if (formErrors[echErr].length) {
        if ($(eleToSelect).siblings(".input-error-msg").length > 0) {
          $(eleToSelect)
            .siblings(".input-error-msg")
            .text(formErrors[echErr])
            .slideDown();
        } else {
          $(
            `<span class="input-error-msg">${formErrors[echErr]}</span>`
          ).insertAfter($(eleToSelect));
        }
      } else {
        if ($(eleToSelect).siblings(".input-error-msg")) {
          $(eleToSelect).siblings(".input-error-msg").slideUp();
        }
      }
    });
  }

  function getElementByDyVal(errorName) {
    let eleToReturn;
    $($form)
      .find("[data-custom-validation]")
      .each(function () {
        if ($(this).data("dy-val") === errorName) {
          eleToReturn = $(this);
        }
      });
    return eleToReturn;
  }

  const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
      // if we have an error string set valid to false
      (val) => val.length > 0 && (valid = false)
    );
    return valid;
  };

  function validateFormHandler() {
    if (validateForm(formErrors)) {
      $($submitBtn).css("cursor", "pointer");
      $($submitBtn).find("*").css("cursor", "pointer");
    } else {
      $($submitBtn).css("cursor", "not-allowed");
      $($submitBtn).find("*").css("cursor", "not-allowed");
    }
  }
}


function validateEmail(stringValue, isRequired) {
  if(!isRequired) return "";
  let result = "";
  if(stringValue.length > 0 && validEmailRegex.test(stringValue)) {
    result = ""
  } else if(stringValue.length > 0 && !validEmailRegex.test(stringValue)) {
    result = "Invalid Email"
  } else if(stringValue.length === 0 && isRequired) {
    result = "Cannot be empty";
  } else if(stringValue.length === 0 && !isRequired) {
    result = "";
  } 
  return result;
}

function validateNumber(stringValue, validateValue, isRequired) {
  if(!isRequired) return "";
  let result = "";
  validateValue = String(validateValue);
  const [min, max] = validateValue.split('-');
  let valueInNumer = Number(stringValue);

  if(max && (stringValue.length >= Number(min) && stringValue.length <= Number(max) && valueInNumer > 0)) {
    result = ""
  } else if(max && (stringValue.length >= Number(max))) {
    result = `Number cannot be more than ${Number(max)}`;
  }else if(stringValue.length < Number(min)) {
    result = `Number cannot be less than ${Number(min)}`;
  } else if(stringValue.length > 0 && Number(min) < 0) {
    result = `Number needs to be atleast ${Number(min)}`;
  } else if(stringValue.length >= Number(min) && valueInNumer > 0) {
    result = ""
  } else if(stringValue.length === 0 && isRequired) {
    result = "Cannot be empty";
  } else if(stringValue.length === 0 && !isRequired) {
    result = "";
  } 

  return result;
}

function validateName(stringValue, validateValue, isRequired) {
  let result = "";
  const [min, max] = validateValue.split('-');
  console.log({min, max, stringValue, isRequired});
  if(stringValue.length >= Number(min) && stringValue.length <= Number(max)) {
    result = ""
  } else if(stringValue.length === 0 && !isRequired) {
    result = "";
  } else if(stringValue.length === 0 && isRequired) {
    result = "Cannot be empty";
  } else if(stringValue.length < Number(min)) {
    result = `Should be atlest ${min} characters`;
  } else if(stringValue.length > Number(max)) {
    result = `Cannot have more than ${max} characters`
  } 
  return result;
}

function validateLink(stringValue, validateValue, isRequired) {
  let result = "";
  const typesAllowed = validateValue.split('-');
  if(typesAllowed.includes("http") && isLinkHttp(stringValue) && validLinkRegex.test(stringValue)) {
    result = ""
  } else if(typesAllowed.includes("https") && isLinkHttps(stringValue) && validLinkRegex.test(stringValue)) {
    result = ""
  } else if(stringValue.length === 0 && isRequired) {
    result = "Cannot be empty";
  } else if(stringValue.length === 0 && !isRequired) {
    result = "";
  } else if(stringValue.length > 0 && !validLinkRegex.test(stringValue)) {
    result = "Invalid link"
  } else if(typesAllowed.includes("http") && !isLinkHttp(stringValue) || typesAllowed.includes("https") && !isLinkHttps(stringValue)) {
    return "Invalid Link"
  }
  return result;
}

function validateDropDown(stringValue, validateValue, isRequired) {
  let result = "";
  console.log({stringValue, validateValue, isRequired});
  if(stringValue === "" && isRequired) {
    result = "Need to be selected";
  } else if(stringValue !== "" && isRequired) {
    result = ""
  } else if(stringValue === "" && !isRequired) {
    result = ""
  } 
  return result;
}

function isLinkHttp(url) {
  return url.match(/^http:\/\//)
}

function isLinkHttps(url) {
  return url.match(/^https:\/\//)
}

// document.addEventListener("DOMContentLoaded", function () {
//    useFormValidation();
// });
