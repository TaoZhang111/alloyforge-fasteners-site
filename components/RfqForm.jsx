"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const ACCEPTED_EXTENSIONS = new Set(["pdf", "dwg", "dxf", "step", "stp", "jpg", "jpeg", "png"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function createInquiryNumber() {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("");
  const random = String(Math.floor(1000 + Math.random() * 9000));
  return `AF-${date}-${random}`;
}

const COUNTRY_OPTIONS = [
  "United States", "Canada", "Mexico", "United Kingdom", "Germany", "France", "Italy",
  "Netherlands", "Spain", "Poland", "Turkey", "United Arab Emirates", "Saudi Arabia",
  "India", "Singapore", "Malaysia", "Indonesia", "Japan", "South Korea", "Australia",
  "Brazil", "South Africa"
];

const MATERIAL_OPTIONS = [
  "Inconel 625", "Inconel 718", "Hastelloy C276", "Monel 400", "Titanium Grade 2",
  "Titanium Grade 5", "Duplex 2205", "Super Duplex 2507"
];

export default function RfqForm({ locale, dict }) {
  const t = dict.quotePage.form;
  const success = dict.quotePage.success;

  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const successRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [product, setProduct] = useState("");
  const [testingOther, setTestingOther] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("product");
    if (requested && t.products.some((option) => option.value === requested)) {
      setProduct(requested);
    }
  }, [t.products]);

  useEffect(() => {
    if (submitted && successRef.current) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      successRef.current.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  }, [submitted]);

  function validationMessage(field) {
    if (field.validity.valueMissing) {
      return t.errors.required;
    }
    if (field.validity.typeMismatch && field.type === "email") {
      return t.errors.email;
    }
    if (field.validity.rangeUnderflow) {
      return t.errors.quantity;
    }
    return t.errors.generic;
  }

  function validateField(field) {
    if (!field.name || field.disabled || field.type === "checkbox" || field.type === "file") {
      return true;
    }

    const isValid = field.checkValidity();
    field.setAttribute("aria-invalid", String(!isValid));
    setErrors((previous) => ({ ...previous, [field.name]: isValid ? "" : validationMessage(field) }));
    return isValid;
  }

  function handleBlur(event) {
    validateField(event.target);
  }

  function handleInput(event) {
    if (event.target.getAttribute?.("aria-invalid") === "true") {
      validateField(event.target);
    }
  }

  function addFiles(incoming) {
    const problems = [];
    const additions = [];

    [...incoming].forEach((file) => {
      const extension = file.name.split(".").pop()?.toLowerCase() || "";
      if (!ACCEPTED_EXTENSIONS.has(extension)) {
        problems.push(`${file.name}: ${t.upload.unsupported}`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        problems.push(`${file.name}: ${t.upload.tooLarge}`);
        return;
      }

      const isDuplicate = [...files, ...additions].some(
        (selected) =>
          selected.name === file.name &&
          selected.size === file.size &&
          selected.lastModified === file.lastModified
      );
      if (!isDuplicate) {
        additions.push(file);
      }
    });

    setUploadError(problems.join(" "));
    setFiles((previous) => [...previous, ...additions]);
  }

  function removeFile(index) {
    setFiles((previous) => previous.filter((_, i) => i !== index));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = formRef.current;
    const fields = [...form.querySelectorAll("input, select, textarea")];
    const invalidFields = fields.filter((field) => !validateField(field));

    if (invalidFields.length) {
      setFormStatus(t.errors.form);
      invalidFields[0].focus();
      return;
    }

    setFormStatus("");
    setSubmitting(true);

    const email = form.elements.email.value;
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted({ number: createInquiryNumber(), email });
    }, 650);
  }

  function startAnother() {
    formRef.current?.reset();
    setErrors({});
    setProduct("");
    setTestingOther(false);
    setFiles([]);
    setUploadError("");
    setFormStatus("");
    setSubmitted(null);
  }

  const fieldError = (name) => (
    <small className="field-error" data-error-for={name}>
      {errors[name] || ""}
    </small>
  );

  if (submitted) {
    return (
      <section className="rfq-success" ref={successRef} aria-labelledby="success-title">
        <span className="success-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m9.2 16.6-4.8-4.8 1.4-1.4 3.4 3.4 9-9 1.4 1.4-10.4 10.4Z" />
          </svg>
        </span>
        <p className="eyebrow dark">{success.eyebrow}</p>
        <h2 id="success-title">{success.title}</h2>
        <p>{success.copy}</p>
        <dl>
          <div>
            <dt>{success.inquiryLabel}</dt>
            <dd>{submitted.number}</dd>
          </div>
          <div>
            <dt>{success.emailLabel}</dt>
            <dd>{submitted.email}</dd>
          </div>
        </dl>
        <div className="success-actions">
          <Link className="button primary" href={`/${locale}`}>
            {success.home}
          </Link>
          <button className="button outline-dark" type="button" onClick={startAnother}>
            {success.another}
          </button>
        </div>
      </section>
    );
  }

  return (
    <form
      className="rfq-form rfq-form-detailed"
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      onBlur={handleBlur}
      onInput={handleInput}
    >
      <fieldset>
        <legend>
          <span>01</span>
          {t.legend1}
        </legend>
        <div className="form-row">
          <label>
            <span>
              {t.name} <b aria-hidden="true">*</b>
            </span>
            <input name="name" type="text" autoComplete="name" required />
            {fieldError("name")}
          </label>
          <label>
            <span>
              {t.email} <b aria-hidden="true">*</b>
            </span>
            <input name="email" type="email" autoComplete="email" required />
            {fieldError("email")}
          </label>
        </div>
        <div className="form-row">
          <label>
            <span>
              {t.company} <b aria-hidden="true">*</b>
            </span>
            <input name="company" type="text" autoComplete="organization" required />
            {fieldError("company")}
          </label>
          <label>
            <span>
              {t.country} <b aria-hidden="true">*</b>
            </span>
            <input name="country" type="text" list="country-options" autoComplete="country-name" required />
            {fieldError("country")}
          </label>
        </div>
        <datalist id="country-options">
          {COUNTRY_OPTIONS.map((country) => (
            <option key={country} value={country}></option>
          ))}
        </datalist>
      </fieldset>

      <fieldset>
        <legend>
          <span>02</span>
          {t.legend2}
        </legend>
        <div className="form-row">
          <label>
            <span>
              {t.productType} <b aria-hidden="true">*</b>
            </span>
            <select name="product" required value={product} onChange={(event) => setProduct(event.target.value)}>
              <option value="">{t.productPlaceholder}</option>
              {t.products.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldError("product")}
          </label>
          <label>
            <span>
              {t.materialGrade} <b aria-hidden="true">*</b>
            </span>
            <input name="material" type="text" list="material-options" placeholder={t.materialPlaceholder} required />
            {fieldError("material")}
          </label>
        </div>
        <label className="conditional-field" hidden={product !== "Other"}>
          <span>
            {t.productOther} <b aria-hidden="true">*</b>
          </span>
          <input name="productOther" type="text" required={product === "Other"} />
          {fieldError("productOther")}
        </label>
        <datalist id="material-options">
          {MATERIAL_OPTIONS.map((material) => (
            <option key={material} value={material}></option>
          ))}
        </datalist>

        <div className="form-row">
          <label>
            <span>{t.size}</span>
            <input name="size" type="text" placeholder={t.sizePlaceholder} />
          </label>
          <div className="quantity-field">
            <label>
              <span>
                {t.quantity} <b aria-hidden="true">*</b>
              </span>
              <span className="quantity-control">
                <input name="quantity" type="number" inputMode="numeric" min="1" step="1" required />
                <select name="quantityUnit" aria-label={t.quantityUnitAria}>
                  {t.units.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </span>
              {fieldError("quantity")}
            </label>
          </div>
        </div>

        <div className="form-row">
          <label>
            <span>{t.standard}</span>
            <input name="standard" type="text" placeholder={t.standardPlaceholder} />
          </label>
          <label>
            <span>
              {t.destination} <b aria-hidden="true">*</b>
            </span>
            <input name="destination" type="text" placeholder={t.destinationPlaceholder} required />
            {fieldError("destination")}
          </label>
        </div>

        <div className="control-group">
          <span className="control-label">{t.testingLabel}</span>
          <div className="checkbox-grid">
            {t.testingOptions.map((option) => (
              <label key={option.value} className="check-control">
                <input type="checkbox" name="testing" value={option.value} />
                <span>{option.label}</span>
              </label>
            ))}
            <label className="check-control">
              <input
                type="checkbox"
                name="testing"
                value="Other"
                checked={testingOther}
                onChange={(event) => setTestingOther(event.target.checked)}
              />
              <span>{t.testingOtherToggle}</span>
            </label>
          </div>
          <label className="conditional-field compact" hidden={!testingOther}>
            <span>{t.testingOther}</span>
            <input name="testingOther" type="text" />
          </label>
        </div>

        <label>
          <span>{t.notes}</span>
          <textarea name="notes" rows={4} placeholder={t.notesPlaceholder}></textarea>
        </label>
      </fieldset>

      <fieldset>
        <legend>
          <span>03</span>
          {t.legend3}
        </legend>
        <div
          className={`upload-zone${dragging ? " is-dragging" : ""}`}
          role="button"
          tabIndex={0}
          aria-controls="drawing-upload"
          aria-describedby="upload-formats upload-error"
          onClick={(event) => {
            if (event.target !== fileInputRef.current) {
              fileInputRef.current?.click();
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            addFiles(event.dataTransfer.files);
          }}
        >
          <input
            id="drawing-upload"
            name="drawings"
            type="file"
            accept=".pdf,.dwg,.dxf,.step,.stp,.jpg,.jpeg,.png"
            multiple
            ref={fileInputRef}
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />
          <span className="upload-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M11 16V7.8L8.4 10.4 7 9l5-5 5 5-1.4 1.4L13 7.8V16h-2Zm-5 4a3 3 0 0 1-3-3v-2h2v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2h2v2a3 3 0 0 1-3 3H6Z" />
            </svg>
          </span>
          <strong>{t.upload.title}</strong>
          <span>
            {t.upload.dragHere} <u>{t.upload.browse}</u>
          </span>
          <small id="upload-formats">{t.upload.formats}</small>
        </div>
        <p className="upload-error" id="upload-error" aria-live="polite">
          {uploadError}
        </p>
        <ul className="file-list" aria-label={t.upload.filesAria}>
          {files.map((file, index) => (
            <li key={`${file.name}-${file.size}-${file.lastModified}`}>
              <span className="file-type">{file.name.split(".").pop()?.toUpperCase() || "FILE"}</span>
              <span className="file-meta">
                <strong>{file.name}</strong>
                <small>
                  {formatFileSize(file.size)} · {t.upload.ready}
                </small>
              </span>
              <button
                className="file-remove"
                type="button"
                aria-label={`${t.upload.remove} ${file.name}`}
                onClick={() => removeFile(index)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        <label className="confidentiality-control">
          <input type="checkbox" name="confidentiality" />
          <span>
            <strong>{t.confidentiality.title}</strong>
            <small>{t.confidentiality.copy}</small>
          </span>
        </label>
      </fieldset>

      <div className="submit-row">
        <button className="button primary form-submit" type="submit" disabled={submitting}>
          <span>{submitting ? t.submitting : t.submit}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M13.2 5.2 20 12l-6.8 6.8-1.2-1.2 4.8-4.8H4v-1.6h12.8L12 6.4l1.2-1.2Z" />
          </svg>
        </button>
        <p className="form-status" aria-live="polite">
          {formStatus}
        </p>
      </div>
    </form>
  );
}
