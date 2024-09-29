import { useEffect, useRef, useState } from 'react';
import removeImg from '../assets/removeImg.svg';
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { socketInitializer, disconnectSocket, updateSocketState } from '../redux/socketSlice';
import { updateState, updateWholeState } from '../redux/messageSlice';

const Main = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [isError, setIsError] = useState("");
  const [internalTxt, setInternalTxt] = useState('');

  const dispatch = useDispatch();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { socket, correctedMessage } = useSelector((state) => state.websocket);
  const { divValue, errorsArr, isLoading, isFocused, wordCount } = useSelector((state) => state.message);

  const divRef = useRef(null);
  const timerRef = useRef(null);

  const handleFocus = () => dispatch(updateState({ key: 'isFocused', value: !isFocused }));

  useEffect(() => {
    if (divRef && divValue && !isTyping) {
      handleDiv(divValue);
      if (isFocused) divRef.current.focus();
      else divRef.current.blur();
    }
  }, [divValue, isTyping]);

  async function handleCaptcha() {
    if (!executeRecaptcha) {
      console.log("Recaptcha not available");
      return;
    }
    return await executeRecaptcha("homepage");
  }

  async function initCaptchaSocket() {
    const recaptchaToken = await handleCaptcha();
    if (!recaptchaToken) {
      console.log('recaptcha token not available');
      return;
    }

    const response = await fetch("https://api.korrektor.az/api/v1/grammar/generate-ws-key/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        recaptcha: recaptchaToken
      })
    });

    if (!response.ok) {
      console.error("Could not fetch data");
      return;
    }

    const responseKey = await response.json();
    dispatch(socketInitializer({ data: null, key: responseKey.key }));
  }

  useEffect(() => {
    initCaptchaSocket();
    return () => {
      dispatch(disconnectSocket());
    };
  }, [dispatch, executeRecaptcha]);

  function handleTyping(e) {
    clearTimeout(timerRef.current);
    setIsTyping(true);

    let value = DOMPurify.sanitize(e.target.innerText).trim();

    setInternalTxt(value);

    let isError = false;
    if (value.length > 2500) {
      setIsError('Maksimum limitə çatdınız! : 2500');
      isError = true;
    } else if (value.length < 2 && value.length != "") {
      setIsError('Minimum 2 hərf daxil etməlisiniz!');
      isError = true;
    } else {
      setIsError("");
    }

    if (!isError) {
      timerRef.current = setTimeout(() => {
        setIsTyping(false);

        updateSocketState({ key: "correctedMessage", value: "" });
        dispatch(
          updateWholeState({
            divValue: "",
            wordCount: 0,
            errorsArr: [],
            plainText: value,
            isLoading: value.length > 0,
          })
        );

        const message = { text: value };
        if (
          socket.readyState === WebSocket.CLOSED ||
          socket.readyState === WebSocket.CLOSING
        ) {
          console.log("closed");
          if (value !== '') createSocket(JSON.stringify(message));
          else createSocket();
        } else if (socket.readyState === WebSocket.OPEN) {
          if (value !== '') socket.send(JSON.stringify(message));
        } else if (socket.readyState === WebSocket.CONNECTING) {
          socket.onopen = () => {
            if (value !== '') socket.send(JSON.stringify(message));
          };
        }
      }, 1100);
    }
  }

  function setCaretPositionToEnd(element) {
    const range = document.createRange();
    const sel = getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function handleDiv(resValue) {
    if (!isLoading) {
      const displayText = resValue.replace(/\n/g, '<br>');
      divRef.current.innerHTML = displayText;
      setCaretPositionToEnd(divRef.current);
    }
  }

  function handleTehlilEt(type, index) {
    let updatedErrorsArr = [...errorsArr];
    let updatedDivValue = divValue;

    if (type === 'correctAll') {
      dispatch(updateWholeState({
        divValue: `<span>${correctedMessage}</span>`,
        errorsArr: [],
        wordCount: correctedMessage ? correctedMessage.split(' ').length : 0,
      }));
    } else {
      if (type === 'update' || type === 'remove') {
        const { wrong, correct } = errorsArr[index];
        const replacement = type === 'update' ? correct : wrong;

        updatedDivValue = updatedDivValue.replace(
          `<span class="border-b border-red-600">${wrong}</span>`,
          `<span>${replacement}</span>`
        );

        updatedErrorsArr.splice(index, 1);
      }

      dispatch(updateWholeState({
        divValue: updatedDivValue,
        errorsArr: updatedErrorsArr,
        errorCount: updatedErrorsArr.length,
      }));
    }
  }

  return (
    <main className="main-content">
      {!socket
        ? <h2 className="loading-text">
          Yüklənilir...
        </h2>
        : <>
          <div className="editor-container">
            <div className="editable-div">
              <div
                ref={divRef}
                contentEditable="true"
                spellCheck="false"
                onBlur={handleFocus}
                onFocus={handleFocus}
                className='resultDiv'
                onPaste={(event) => {
                  event.preventDefault();

                  const pastedData = (event.clipboardData || Clipboard).getData('text');

                  document.execCommand('insertText', false, pastedData);
                }}
                onInput={handleTyping}
                suppressContentEditableWarning={true}
              />
              {isError && (
                <div className={`errorDiv flex justify-between items-center gap-4`}>
                  <p className='error-label'>{isError}</p>
                  <p className='error-label'>{2500 - internalTxt.length}</p>
                </div>
              )}
            </div>
            <div className="controls">
              {isLoading ? (
                <h2 className="analyzing-text flex items-end justify-center">Təhlil edilir...</h2>
              ) : (
                <div className="stats">
                  <h2>Korrektor</h2>
                  <hr className="m-0" />
                  <div className="flex gap-8 mt-2">
                    <p className="word-count">Söz: {wordCount}</p>
                    <p className="error-count">
                      <span className="error-label">Xəta:</span>{' '}
                      <span className="error-number">{errorsArr.length}</span>
                    </p>
                  </div>
                  {errorsArr.length === 0 ? (
                    <p className="no-error-text">Heç bir səhv yoxdur</p>
                  ) : (
                    <div className='error-list'>
                      <div className="error-label flex justify-between items-center errorContainer cursor-default">
                        {errorsArr.length} xəta var
                        <button onClick={() => handleTehlilEt('correctAll')} id="acceptAllBtn">
                          Hamısını qəbul et
                        </button>
                      </div>
                      {errorsArr.map((error, index) => (
                        <div
                          onClick={() => handleTehlilEt('update', index)}
                          key={index}
                          className="error-item"
                        >
                          <div className='w-11/12 overflow-auto flex items-center gap-1 flex-wrap'>
                            <p className='flex items-center gap-1'>
                              Sil: <span className="error-label">{error.wrong}</span>,
                            </p>
                            <p className='flex items-center gap-1'>
                              Yaz:
                              <span
                                dangerouslySetInnerHTML={{ __html: error.correct }}
                              />
                            </p>
                          </div>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleTehlilEt('remove', index);
                            }}
                          >
                            <img src={removeImg} alt="removeBtn" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      }
    </main>
  );
};

export default Main;
