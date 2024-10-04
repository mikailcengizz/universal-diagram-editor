export const UPDATE_SELECTED_META_MODEL = "UPDATE_SELECTED_META_MODEL";

export const updateSelectedMetaModel = (config: string | null) => ({
  type: UPDATE_SELECTED_META_MODEL,
  payload: config,
});
