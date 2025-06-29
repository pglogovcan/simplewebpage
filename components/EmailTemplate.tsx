import * as React from "react";

export const EmailTemplate = () => {

  return (
    <>
    <h2>Confirm your signup</h2>
    <p>Follow this link to confirm your user:</p>
    <p>
        <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Confirm your mail</a>
        </p>
        </>
  );
};

export default EmailTemplate;