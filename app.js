gnore
const formsIds = ['overview-form', 'solutions-form', 'service-form', 'faq-form', 'video-form', 'news-form','event-form'];
gnore

gnore

gnore
const pleaseWaitText = "Please Wait while we fetch translation...";
gnore
const editorData = {};
gnore
let currentLanguage = "DE";
gnore

gnore
const tryAgainText = "Try Again";
gnore

gnore
// To validate Email
gnore
const validEmailRegex = RegExp(
gnore
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
gnore
);
gnore

gnore
const validLinkRegex = RegExp(
gnore
  /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
gnore
);
gnore

gnore
// Weglot Code
gnore
if (Weglot) {
gnore
  Weglot.on("initialized", () => {
gnore
    activateWeglot();
gnore
  });
gnore
  Weglot.on("languageChanged", () => {
gnore
    activateWeglot();
gnore
  });
gnore
} else {
gnore
  initializeForms();
gnore
}
gnore

gnore
function activateWeglot() {
gnore
  currentLanguage = Weglot?.getCurrentLang()?.toUpperCase();
gnore
  initializeForms();
gnore
}
gnore

gnore
// Editor Code
gnore
const icons = Quill.import("ui/icons");
gnore
for (let i = 2; i <= 6; i += 1) {
gnore
  icons.header[i] = `<b>H${i}</b>`;
gnore
}
gnore

gnore
$(".editor").each(function (idx) {
gnore
  $(this).data("editor-id", `editor${idx}`);
gnore
  var quill = new Quill(this, {
gnore
    modules: {
gnore
      toolbar: [
gnore
        ["bold", "italic"],
gnore
        [
gnore
          { header: 2 },
gnore
          { header: 3 },
gnore
          { header: 4 },
gnore
          { header: 5 },
gnore
          { header: 6 },
gnore
        ],
gnore
        ["link", "blockquote", "video"],
gnore
        [{ list: "ordered" }, { list: "bullet" }],
gnore
      ],
gnore
    },
gnore
    placeholder: "Compose an epic...",
gnore
    theme: "snow",
gnore
  });
gnore

gnore
  editorData[`editor${idx}`] = quill;
gnore

gnore
  var $form = $(this).closest("form");
gnore
  $form.submit(() => {
gnore
    // Populate hidden form on submit
gnore
    var $about = $(this).siblings("textarea.editor-data");
gnore
    $about.text(quill.root.innerHTML);
gnore
  });
gnore
});
gnore

gnore
function initializeForms() {
gnore
  // Form Code
gnore
  formsIds.forEach((echId) => {
gnore
    const $form = $(`#${echId}`);
gnore
    if ($form) {
gnore
      initApp($form);
gnore
    }
gnore
  });
gnore
}
gnore

gnore
$("#update-item").show();
gnore

gnore
function initApp(parentEle) {
gnore
  const $form = $(parentEle);
gnore
  const otherLangInputs = [];
gnore
  const currLangInputs = [];
gnore
  let formErrors = {};
gnore

gnore
  if (!$form) {
gnore
    console.log("No Parent Found");
gnore
    return;
gnore
  }
gnore

gnore
  const customValidationInputsArr = $($form).find("[data-custom-validation]");
gnore

gnore
  const $submitBtn = $($form).find("[data-form-submit]");
gnore

gnore
  $form.on("keyup change", validateFormHandler);
gnore
  $submitBtn.click(handleSubmit);
gnore

gnore
  getCustomValidationInputs($form);
gnore

gnore
  $($form)
gnore
    .find("[data-type-lang]")
gnore
    .each(function () {
gnore
      if ($(this).data("type-lang") !== currentLanguage) {
gnore
        $(this).slideUp();
gnore
        const innerInputs = $(this).find("[data-input-type]");
gnore
        otherLangInputs.push(innerInputs);
gnore
      } else {
gnore
        $(this).slideDown();
gnore
        const innerInputs = $(this).find("[data-input-type]");
gnore
        currLangInputs.push(innerInputs);
gnore
        hideTranslateBtn($($form).find("[data-translate-btn]"));
gnore
        getAndLoopInputs(this);
gnore
        addOnChangeELToInput(this);
gnore
      }
gnore
    });
gnore

gnore
  $($form)
gnore
    .find("[data-translate-btn]")
gnore
    .click(function () {
gnore
      const eleToShow = $(this).data("translate-btn");
gnore
      if (Boolean($(this).data("isOn"))) {
gnore
        $(this).data("isOn", "");
gnore
        $($form)
gnore
          .find(`[data-input-type=${eleToShow}]`)
gnore
          .parent()
gnore
          .not(`[data-type-lang=${currentLanguage}]`)
gnore
          .slideUp();
gnore
      } else {
gnore
        $(this).data("isOn", "true");
gnore

gnore
        $($form)
gnore
          .find(`[data-input-type=${eleToShow}]`)
gnore
          .parent()
gnore
          .not(`[data-type-lang=${currentLanguage}]`)
gnore
          .slideDown();
gnore

gnore
        const eleInCurrLang = $($form)
gnore
          .find(`[data-type-lang=${currentLanguage}]`)
gnore
          .children(`[data-input-type=${eleToShow}]`);
gnore

gnore
        const eleInOtherLang = $($form)
gnore
          .find(`[data-type-lang]`)
gnore
          .not(`[data-type-lang=${currentLanguage}]`)
gnore
          .children(`[data-input-type=${eleToShow}]`);
gnore

gnore
        handleTranslation(eleInCurrLang, eleInOtherLang).then((data) => {
gnore
          console.log("done Translating");
gnore
        });
gnore
      }
gnore
    });
gnore

gnore
  function getCustomValidationInputs(formEle) {
gnore
    if (!formEle) return;
gnore
    $(formEle)
gnore
      .find("[data-custom-validation]")
gnore
      .each(function () {
gnore
        addInputChangeEL(this);
gnore
      });
gnore
  }
gnore

gnore
  // check if editor is empty
gnore
  function checkIfEditorIsEmpty(domEle) {
gnore
    if (!domEle) return;
gnore
    return getEditorObj(domEle).getText().length > 1 ? false : true;
gnore
  }
gnore

gnore
  function getEditorObj(ele) {
gnore
    if (Object.keys(editorData).length === 0) return;
gnore
    const currEleEditorId = $(ele).data("editor-id");
gnore
    if (!currEleEditorId) return;
gnore
    const currEleQuillObj = editorData[currEleEditorId];
gnore
    return currEleQuillObj;
gnore
  }
gnore

gnore
  //get input by data-input-type
gnore
  function getAndLoopInputs(parentEle) {
gnore
    if (!parentEle) return;
gnore
    const innerInput = $(parentEle).find("[data-input-type]");
gnore
    if ($(innerInput).is("div")) return;
gnore
    addRequiredProp(innerInput);
gnore
  }
gnore

gnore
  // Set required to inputs dynamically
gnore
  function addRequiredProp(domEle) {
gnore
    if (!domEle) return;
gnore
    $(domEle).prop("required", true);
gnore
  }
gnore

gnore
  // Add EventListeners to input
gnore
  function addOnChangeELToInput(domEle) {
gnore
    let innerInput = $(domEle).find("[data-input-type]");
gnore
    const typeOfInput = $(innerInput).data("input-type");
gnore

gnore
    if ($(innerInput).is("div")) {
gnore
      const editorObj = getEditorObj(innerInput);
gnore
      editorObj.on("text-change", function (delta, oldDelta, source) {
gnore
        if (editorObj.getText().length > 1) {
gnore
          showTranslateBtn(
gnore
            $(domEle).siblings().children(`[data-translate-btn=${typeOfInput}]`)
gnore
          );
gnore
        } else {
gnore
          hideTranslateBtn(
gnore
            $(domEle).siblings().children(`[data-translate-btn=${typeOfInput}]`)
gnore
          );
gnore
        }
gnore
      });
gnore
    } else {
gnore
      $(innerInput).on("change keyup paste", function (e) {
gnore
        if ($(innerInput).val().length > 0) {
gnore
          showTranslateBtn(
gnore
            $(domEle).siblings().children(`[data-translate-btn=${typeOfInput}]`)
gnore
          );
gnore
        } else {
gnore
          hideTranslateBtn(
gnore
            $(domEle).siblings().children(`[data-translate-btn=${typeOfInput}]`)
gnore
          );
gnore
        }
gnore
      });
gnore
    }
gnore
  }
gnore

gnore
  // show hide translate btns
gnore
  function hideTranslateBtn(arrOfEle) {
gnore
    $(arrOfEle).parent("div").slideUp().data("isHidden", true);
gnore
  }
gnore

gnore
  function showTranslateBtn(ele) {
gnore
    if ($(ele).parent("div").data("isHidden")) {
gnore
      $(ele).parent("div").slideDown().data("isHidden", false);
gnore
    }
gnore
    return;
gnore
  }
gnore

gnore
  // check if input is empty
gnore
  function checkIfInputIsEmpty(ele) {
gnore
    if (!ele) return;
gnore
    return $(ele).val().length > 0 ? false : true;
gnore
  }
gnore

gnore
  function testIfAllInputsAreValidate() {
gnore
    $(customValidationInputsArr).each(function () {
gnore
      checkForFormErrors(null, this);
gnore
    });
gnore
  }
gnore

gnore
  // if empty -> get translation -> add it to form inputs
gnore
  async function handleSubmit(e) {
gnore
    $(e.target).text(pleaseWaitText);
gnore
    testIfAllInputsAreValidate();
gnore
    validateFormHandler();
gnore

gnore
    // handle translations
gnore
    const resData = await Promise.all(
gnore
      otherLangInputs.map(async (echInput, idx) => {
gnore
        if (
gnore
          (isItAEditor(echInput) && checkIfEditorIsEmpty(echInput)) ||
gnore
          (!isItAEditor(echInput) && checkIfInputIsEmpty($(echInput)))
gnore
        ) {
gnore
          return await handleTranslation(currLangInputs[idx], echInput);
gnore
        }
gnore
      })
gnore
    );
gnore

gnore
    console.log("done", resData);
gnore
    if (validateForm(formErrors)) {
gnore
      $form.submit();
gnore
    } else {
gnore
      $(e.target).text(tryAgainText);
gnore
    }
gnore
  }
gnore

gnore
  function isItAEditor(ele) {
gnore
    if (!ele) return null;
gnore
    return $(ele).is("div") ? true : false;
gnore
  }
gnore

gnore
  async function handleTranslation(currEleWithText, toAddTranslationEle) {
gnore
    try {
gnore
      const langToTranslate = $(toAddTranslationEle)
gnore
        .parent("[data-type-lang]")
gnore
        .data("type-lang");
gnore
      const sourceLang = $(currEleWithText)
gnore
        .parent("[data-type-lang]")
gnore
        .data("type-lang");
gnore

gnore
      console.log({ langToTranslate, sourceLang });
gnore

gnore
      if (isItAEditor(currEleWithText)) {
gnore
        const toTransEleQuillObj = getEditorObj(toAddTranslationEle);
gnore
        toTransEleQuillObj.setText(pleaseWaitText);
gnore
        const textToTranslate = getEditorObj(currEleWithText).getText();
gnore
        console.log({ textToTranslate });
gnore
        const [text] = await getTranslation(
gnore
          textToTranslate,
gnore
          langToTranslate,
gnore
          sourceLang
gnore
        );
gnore
        toTransEleQuillObj.setText(text);
gnore
        return text;
gnore
      } else {
gnore
        $(toAddTranslationEle).val(pleaseWaitText);
gnore
        const textValueOfCurrLang = $(currEleWithText).val();
gnore
        const [text] = await getTranslation(
gnore
          textValueOfCurrLang,
gnore
          langToTranslate,
gnore
          sourceLang
gnore
        );
gnore
        $(toAddTranslationEle).val(text);
gnore
        return text;
gnore
      }
gnore
    } catch (error) {
gnore
      console.log({ error });
gnore
      return "";
gnore
    }
gnore
  }
gnore

gnore
  async function getTranslation(text, lang, sourceLang = "") {
gnore
    try {
gnore
      console.log({ text, lang });
gnore
      if (!text) return;
gnore
      text = encodeURIComponent(text);
gnore
      const arrOfText = [{ text, lang, sourceLang }];
gnore
      const resData = await fetch('https://deepl-translate-app.herokuapp.com/translate', {
gnore
        method: "POST",
gnore
        headers: {
gnore
          "Content-Type": "application/json",
gnore
        },
gnore
        body: JSON.stringify({ arrOfText }),
gnore
      });
gnore
      const { translatedTextArr } = await resData.json();
gnore
      console.log({ translatedTextArr });
gnore
      return translatedTextArr;
gnore
    } catch (error) {
gnore
      console.log({ error });
gnore
      return [""];
gnore
    }
gnore
  }
gnore

gnore
  function addInputChangeEL(inputEle) {
gnore
    if (!inputEle) return;
gnore
    $(inputEle).on("keyup change", checkForFormErrors);
gnore
    const inputDataName = $(inputEle).attr("name");
gnore
    let inputName = $(inputEle).data("dy-val");
gnore
    if (!inputName) {
gnore
      inputName = `${inputDataName + Math.floor(Math.random() * 10)}`;
gnore
      $(inputEle).data("dy-val", inputName);
gnore
    }
gnore
    if (!formErrors[inputName]) {
gnore
      formErrors[inputName] = "";
gnore
    }
gnore
  }
gnore

gnore
  function getInputValidationType(domEle) {
gnore
    let typeOfValidation = {};
gnore
    if ($(domEle).data("validate-link")) {
gnore
      typeOfValidation["dataName"] = "link";
gnore
      typeOfValidation["dataValue"] = $(domEle).data("validate-link");
gnore
    } else if ($(domEle).data("validate-number")) {
gnore
      typeOfValidation["dataName"] = "number";
gnore
      typeOfValidation["dataValue"] = $(domEle).data("validate-number");
gnore
    } else if ($(domEle).data("validate-email")) {
gnore
      typeOfValidation["dataName"] = "email";
gnore
      typeOfValidation["dataValue"] = $(domEle).data("validate-email");
gnore
    } else if ($(domEle).data("validate-name")) {
gnore
      typeOfValidation["dataName"] = "name";
gnore
      typeOfValidation["dataValue"] = $(domEle).data("validate-name");
gnore
    } else if ($(domEle).data("validate-select")) {
gnore
      typeOfValidation["dataName"] = "select";
gnore
      typeOfValidation["dataValue"] = $(domEle).data("validate-select");
gnore
    }
gnore
    return typeOfValidation;
gnore
  }
gnore

gnore
  function checkForFormErrors(e, ele) {
gnore
    let name;
gnore
    let value;
gnore
    let toValidateType;
gnore
    let toValidateTypeValue;
gnore
    let isRequired = false;
gnore

gnore
    if (ele) {
gnore
      name = $(ele).data("dy-val");
gnore
      value = $(ele).val();
gnore
      const { dataName, dataValue } = getInputValidationType(ele);
gnore
      toValidateType = dataName;
gnore
      toValidateTypeValue = dataValue;
gnore
      isRequired = $(ele).data("is-required");
gnore
    } else {
gnore
      name = $(e.target).data("dy-val");
gnore
      value = e.target.value;
gnore
      const { dataName, dataValue } = getInputValidationType(e.target);
gnore
      toValidateType = dataName;
gnore
      toValidateTypeValue = dataValue;
gnore
      isRequired = $(e.target).data("is-required");
gnore
    }
gnore

gnore
    let errors = { ...formErrors };
gnore
    switch (toValidateType) {
gnore
      case "email":
gnore
        errors[name] = validateEmail(value, isRequired);
gnore
        break;
gnore
      case "name":
gnore
        errors[name] = validateName(value, toValidateTypeValue, isRequired);
gnore
        break;
gnore
      case "link":
gnore
        errors[name] = validateLink(value, toValidateTypeValue, isRequired);
gnore
        break;
gnore
      case "number":
gnore
        errors[name] = validateNumber(value, toValidateTypeValue, isRequired);
gnore
        break;
gnore
      case "select":
gnore
        errors[name] = validateDropDown(value, toValidateTypeValue, isRequired);
gnore
        break;
gnore
      default:
gnore
        break;
gnore
    }
gnore
    updateFormErrors(errors);
gnore
  }
gnore

gnore
  function updateFormErrors(errors) {
gnore
    formErrors = { ...formErrors, ...errors };
gnore
    Object.keys(formErrors).forEach((echErr) => {
gnore
      const eleToSelect = getElementByDyVal(echErr);
gnore
      if (formErrors[echErr].length) {
gnore
        if ($(eleToSelect).siblings(".input-error-msg").length > 0) {
gnore
          $(eleToSelect)
gnore
            .siblings(".input-error-msg")
gnore
            .text(formErrors[echErr])
gnore
            .slideDown();
gnore
        } else {
gnore
          $(
gnore
            `<span class="input-error-msg">${formErrors[echErr]}</span>`
gnore
          ).insertAfter($(eleToSelect));
gnore
        }
gnore
      } else {
gnore
        if ($(eleToSelect).siblings(".input-error-msg")) {
gnore
          $(eleToSelect).siblings(".input-error-msg").slideUp();
gnore
        }
gnore
      }
gnore
    });
gnore
  }
gnore

gnore
  function getElementByDyVal(errorName) {
gnore
    let eleToReturn;
gnore
    $($form)
gnore
      .find("[data-custom-validation]")
gnore
      .each(function () {
gnore
        if ($(this).data("dy-val") === errorName) {
gnore
          eleToReturn = $(this);
gnore
        }
gnore
      });
gnore
    return eleToReturn;
gnore
  }
gnore

gnore
  const validateForm = (errors) => {
gnore
    let valid = true;
gnore
    Object.values(errors).forEach(
gnore
      // if we have an error string set valid to false
gnore
      (val) => val.length > 0 && (valid = false)
gnore
    );
gnore
    return valid;
gnore
  };
gnore

gnore
  function validateFormHandler() {
gnore
    if (validateForm(formErrors)) {
gnore
      $($submitBtn).css("cursor", "pointer");
gnore
      $($submitBtn).find("*").css("cursor", "pointer");
gnore
    } else {
gnore
      $($submitBtn).css("cursor", "not-allowed");
gnore
      $($submitBtn).find("*").css("cursor", "not-allowed");
gnore
    }
gnore
  }
gnore
}
gnore

gnore

gnore
function validateEmail(stringValue, isRequired) {
gnore
  if(!isRequired) return "";
gnore
  let result = "";
gnore
  if(stringValue.length > 0 && validEmailRegex.test(stringValue)) {
gnore
    result = ""
gnore
  } else if(stringValue.length > 0 && !validEmailRegex.test(stringValue)) {
gnore
    result = "Invalid Email"
gnore
  } else if(stringValue.length === 0 && isRequired) {
gnore
    result = "Cannot be empty";
gnore
  } else if(stringValue.length === 0 && !isRequired) {
gnore
    result = "";
gnore
  } 
gnore
  return result;
gnore
}
gnore

gnore
function validateNumber(stringValue, validateValue, isRequired) {
gnore
  if(!isRequired) return "";
gnore
  let result = "";
gnore
  validateValue = String(validateValue);
gnore
  const [min, max] = validateValue.split('-');
gnore
  let valueInNumer = Number(stringValue);
gnore

gnore
  if(max && (stringValue.length >= Number(min) && stringValue.length <= Number(max) && valueInNumer > 0)) {
gnore
    result = ""
gnore
  } else if(max && (stringValue.length >= Number(max))) {
gnore
    result = `Number cannot be more than ${Number(max)}`;
gnore
  }else if(stringValue.length < Number(min)) {
gnore
    result = `Number cannot be less than ${Number(min)}`;
gnore
  } else if(stringValue.length > 0 && Number(min) < 0) {
gnore
    result = `Number needs to be atleast ${Number(min)}`;
gnore
  } else if(stringValue.length >= Number(min) && valueInNumer > 0) {
gnore
    result = ""
gnore
  } else if(stringValue.length === 0 && isRequired) {
gnore
    result = "Cannot be empty";
gnore
  } else if(stringValue.length === 0 && !isRequired) {
gnore
    result = "";
gnore
  } 
gnore

gnore
  return result;
gnore
}
gnore

gnore
function validateName(stringValue, validateValue, isRequired) {
gnore
  let result = "";
gnore
  const [min, max] = validateValue.split('-');
gnore
  console.log({min, max, stringValue, isRequired});
gnore
  if(stringValue.length >= Number(min) && stringValue.length <= Number(max)) {
gnore
    result = ""
gnore
  } else if(stringValue.length === 0 && !isRequired) {
gnore
    result = "";
gnore
  } else if(stringValue.length === 0 && isRequired) {
gnore
    result = "Cannot be empty";
gnore
  } else if(stringValue.length < Number(min)) {
gnore
    result = `Should be atlest ${min} characters`;
gnore
  } else if(stringValue.length > Number(max)) {
gnore
    result = `Cannot have more than ${max} characters`
gnore
  } 
gnore
  return result;
gnore
}
gnore

gnore
function validateLink(stringValue, validateValue, isRequired) {
gnore
  let result = "";
gnore
  const typesAllowed = validateValue.split('-');
gnore
  if(typesAllowed.includes("http") && isLinkHttp(stringValue) && validLinkRegex.test(stringValue)) {
gnore
    result = ""
gnore
  } else if(typesAllowed.includes("https") && isLinkHttps(stringValue) && validLinkRegex.test(stringValue)) {
gnore
    result = ""
gnore
  } else if(stringValue.length === 0 && isRequired) {
gnore
    result = "Cannot be empty";
gnore
  } else if(stringValue.length === 0 && !isRequired) {
gnore
    result = "";
gnore
  } else if(stringValue.length > 0 && !validLinkRegex.test(stringValue)) {
gnore
    result = "Invalid link"
gnore
  } else if(typesAllowed.includes("http") && !isLinkHttp(stringValue) || typesAllowed.includes("https") && !isLinkHttps(stringValue)) {
gnore
    return "Invalid Link"
gnore
  }
gnore
  return result;
gnore
}
gnore

gnore
function validateDropDown(stringValue, validateValue, isRequired) {
gnore
  let result = "";
gnore
  console.log({stringValue, validateValue, isRequired});
gnore
  if(stringValue === "" && isRequired) {
gnore
    result = "Need to be selected";
gnore
  } else if(stringValue !== "" && isRequired) {
gnore
    result = ""
gnore
  } else if(stringValue === "" && !isRequired) {
gnore
    result = ""
gnore
  } 
gnore
  return result;
gnore
}
gnore

gnore
function isLinkHttp(url) {
gnore
  return url.match(/^http:\/\//)
gnore
}
gnore

gnore
function isLinkHttps(url) {
gnore
  return url.match(/^https:\/\//)
gnore
}
gnore

gnore
// document.addEventListener("DOMContentLoaded", function () {
gnore
//    useFormValidation();
gnore
// });
