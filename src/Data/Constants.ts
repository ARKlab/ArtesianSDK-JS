export const MetadataVersion = "v2.1";
// regex CharacterValidatorRegEx check for error Invalid string. "Should not contain trailing or leading whitespaces or any of the following characters: ,:;'\"<space>"
export const CharacterValidatorRegEx = /[^\w]/;
//internal const string CharacterValidatorRegEx = @"^[^'"",:;\s](?:(?:[^'"",:;\s]| )*[^'"",:;\s])?$";