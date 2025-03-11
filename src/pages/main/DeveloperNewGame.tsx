import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { applyValue, deleteValue, JsonViewer, JsonViewerOnAdd, JsonViewerOnChange, JsonViewerOnDelete } from "@textea/json-viewer";

import { Box, Stack } from "@mui/material";

import { CONST_GAME_DISTRICT53 } from "../../const/games/district53/District53";

import AccountNextButton from "../../components/account/AccountNextButton";
import { addOneDeveloperGameList } from "../../store/DeveloperGameListSlice";

export interface IPropsDeveloperNewGame {
  setStatus: (_: number) => void;
}

const DeveloperNewGame = ({ setStatus }: IPropsDeveloperNewGame) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [jsonData, setJsonData] = useState(CONST_GAME_DISTRICT53);

  const handleNextClick = useCallback(() => {
    dispatch(addOneDeveloperGameList(jsonData));
    setStatus(0);
  }, [jsonData]);

  return (
    <>
      <Stack gap={3}>
        <Box
          sx={{
            backgroundColor: "#FFFFFF55",
            backdropFilter: "blur(5px)", // Applies the blur effect
            WebkitBackdropFilter: "blur(5px)", // Ensures compatibility with Safari
            padding: 2,
            borderRadius: "16px",
          }}
        >
          <JsonViewer
            editable
            enableAdd={true}
            enableDelete={true}
            theme="dark"
            value={jsonData}
            onChange={useCallback<JsonViewerOnChange>((path, _oldValue, newValue) => {
              setJsonData((src) => applyValue(src, path, newValue));
            }, [])}
            onDelete={useCallback<JsonViewerOnDelete>((path, value) => {
              setJsonData((src) => deleteValue(src, path, value));
            }, [])}
            onAdd={useCallback<JsonViewerOnAdd>((path) => {
              const key = prompt("Enter property key:");
              if (key === null) return;

              const valueInput = prompt(`Enter JSON value for ${key} (e.g., "value", 42, true, {"nested": "obj"}, [1,2,3]):`);
              if (valueInput === null) return;

              try {
                // Attempt to parse JSON, including objects/arrays
                const parsedValue = JSON.parse(
                  valueInput
                    .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Fix keys if needed
                    .replace(/'/g, '"') // Replace single quotes with double quotes
                );

                setJsonData((src) => applyValue(src, [...path, key], parsedValue));
              } catch (e) {
                // Handle primitive values if JSON parsing fails
                if (valueInput === "true") {
                  setJsonData((src) => applyValue(src, [...path, key], true));
                } else if (valueInput === "false") {
                  setJsonData((src) => applyValue(src, [...path, key], false));
                } else if (!isNaN(Number(valueInput))) {
                  setJsonData((src) => applyValue(src, [...path, key], Number(valueInput)));
                } else {
                  // Fallback to string value
                  setJsonData((src) => applyValue(src, [...path, key], valueInput));
                }
              }
            }, [])}
          />
        </Box>
        <AccountNextButton text={t("ncca-7_next")} onClick={handleNextClick} />
      </Stack>
    </>
  );
};

export default DeveloperNewGame;
