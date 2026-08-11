"use client";

import { useEffect, useId, useReducer, useRef } from "react";

import {
  createServiceSelectState,
  reduceServiceSelectState,
} from "./service-select-state.mjs";
import "./ServiceSelect.css";

function fieldClassName(className) {
  return ["service-select-field", className].filter(Boolean).join(" ");
}

export function ServiceSelect({
  className,
  defaultValue = "",
  label = "Tjänst",
  name = "service",
  options,
  placeholder = "Välj tjänst",
}) {
  const fieldId = useId();
  const containerRef = useRef(null);
  const optionRefs = useRef([]);
  const triggerRef = useRef(null);
  const [state, dispatch] = useReducer(
    (currentState, action) =>
      reduceServiceSelectState(currentState, action, options.length),
    undefined,
    () => createServiceSelectState(options, defaultValue),
  );

  const selectedOption = options[state.selectedIndex];
  const selectedLabel = selectedOption?.label ?? placeholder;
  const selectedValue = selectedOption?.value ?? "";
  const labelId = `${fieldId}-label`;
  const listboxId = `${fieldId}-listbox`;
  const valueId = `${fieldId}-value`;

  useEffect(() => {
    if (!state.isOpen) return;
    optionRefs.current[state.activeIndex]?.focus();
  }, [state.activeIndex, state.isOpen]);

  useEffect(() => {
    if (!state.isOpen) return undefined;

    function closeOnOutsidePointer(event) {
      if (!containerRef.current?.contains(event.target)) {
        dispatch({ type: "close" });
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [state.isOpen]);

  function closeAndRestoreFocus() {
    dispatch({ type: "close" });
    triggerRef.current?.focus();
  }

  function selectOption(index) {
    dispatch({ index, type: "select" });
    triggerRef.current?.focus();
  }

  function handleTriggerKeyDown(event) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      dispatch({ type: "open" });
      return;
    }

    if (event.key === "Escape" && state.isOpen) {
      event.preventDefault();
      closeAndRestoreFocus();
    }
  }

  function handleFieldBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      dispatch({ type: "close" });
    }
  }

  function handleOptionKeyDown(event) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      dispatch({
        direction: event.key === "ArrowDown" ? 1 : -1,
        type: "move",
      });
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption(state.activeIndex);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeAndRestoreFocus();
      return;
    }

  }

  return (
    <div className={fieldClassName(className)} onBlur={handleFieldBlur} ref={containerRef}>
      <span className="service-select-label" id={labelId}>
        {label}
      </span>
      <div className={state.isOpen ? "service-select open" : "service-select"}>
        <input name={name} readOnly type="hidden" value={selectedValue} />
        <button
          aria-controls={listboxId}
          aria-expanded={state.isOpen}
          aria-haspopup="listbox"
          aria-labelledby={`${labelId} ${valueId}`}
          className="service-select-trigger"
          disabled={options.length === 0}
          onClick={() => dispatch({ type: state.isOpen ? "close" : "open" })}
          onKeyDown={handleTriggerKeyDown}
          ref={triggerRef}
          type="button"
        >
          <span
            className={selectedOption ? "service-select-value" : "service-select-value placeholder"}
            id={valueId}
          >
            {selectedLabel}
          </span>
          <span aria-hidden="true" className="service-select-chevron" />
        </button>

        {state.isOpen ? (
          <div
            aria-labelledby={labelId}
            className="service-select-menu"
            id={listboxId}
            role="listbox"
          >
            {options.map((option, index) => {
              const isActive = state.activeIndex === index;
              const isSelected = state.selectedIndex === index;

              return (
                <button
                  aria-selected={isSelected}
                  className={[
                    "service-select-option",
                    isActive ? "active" : "",
                    isSelected ? "selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={option.value}
                  onClick={() => selectOption(index)}
                  onKeyDown={handleOptionKeyDown}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  role="option"
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                >
                  <span>{option.label}</span>
                  {isSelected ? (
                    <span aria-hidden="true" className="service-select-check">
                      ✓
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
