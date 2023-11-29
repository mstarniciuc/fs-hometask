import {ProfileType} from "./types";

export const transformModelToOption = (models: ProfileType[]) => models.map((model: ProfileType) =>({
    value: model.id.toString(),
    label: `${model.firstName} ${model.lastName}`
}));