export const renderTicket = (html, data) => {
  let result = html;
  Object.keys(data).forEach((key) => {
    result = result.replaceAll(`{{${key}}}`, data[key]);
  });
  return result;
};
