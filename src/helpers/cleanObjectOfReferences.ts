/**
 * Cleans all JavaScript referneces and prototypes from Object
 * so it can be stored in Firestore.
 * @param input The JS Object to clean
 * @param keepDocumentReferenceId Should we keep reference ids for relationships
 */
export default async function cleanObjectOfReferences(
  input: any,
  keepDocumentReferenceId = false
) {
  const data = input;
  for (const key of Object.keys(input)) {
    const value = input[key];
    if (!value) continue;
    try {
      if (value?.constructor?.name === "Object") {
        data[key] = await cleanObjectOfReferences(value);
      } else if (value?.constructor?.name === "DocumentReference") {
        keepDocumentReferenceId
          ? (data[key] = { id: value.id })
          : delete data[key];
      } else if (value?.constructor?.name === "Timestamp") {
        data[key] = value.toDate();
      } else if (value?.constructor?.name === "Array") {
        const cleanArray: any[] = [];
        for (const item of data[key]) {
          cleanArray.push(await cleanObjectOfReferences(item));
        }
        data[key] = cleanArray;
      } else if (
        typeof value === "object" &&
        value?.constructor?.name !== "Date"
      ) {
        data[key] = await cleanObjectOfReferences(
          JSON.parse(JSON.stringify(value))
        );
      }
    } catch (err) {
      delete data[key];
    }
  }

  return JSON.parse(JSON.stringify(data));
}
