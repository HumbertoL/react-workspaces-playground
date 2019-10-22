
// Use empty string by default to reserve the space that would normally be taken up by the
// error message. This makes the pages less jumpy on validation errors.
export const getHelperText = (wasTouched, errorMessage) => (wasTouched && errorMessage) || ' ';
