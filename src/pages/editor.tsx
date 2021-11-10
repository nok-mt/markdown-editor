import * as React from "react";
import styled from "styled-components";
import { putMemo } from "../indexeddb/memos";
import { Button } from "../components/button";
import { SaveModal } from "../components/save_modal";
import { Link } from "react-router-dom";
import { Header } from "../components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import ConvertMarkdownWorker from "worker-loader!../worker/convert_markdown_worker";

const convertMarkdownWorker = new ConvertMarkdownWorker();
const { useState, useEffect } = React;

const Wrapper = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 3rem;
  display: flex;
`;

const HeaderArea = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
`;

const TextArea = styled.textarea`
  border-right: 1px solid silver;
  border-top: 1px solid silver;
  font-size: 1rem;
  padding: 1rem;
  width: 100%;
  &::placeholder {
    color: #c5c5c5;
  }
`;

const Preview = styled.div`
  border-top: 1px solid silver;
  overflow-y: scroll;
  padding: 1rem;
  width: 100%;
`;

const StyledIcon = styled(FontAwesomeIcon)`
  margin-left: 0.5rem;
`;

interface Props {
  text: string;
  setText: (text: string) => void;
}

export const Editor: React.FC<Props> = (props) => {
  const { text, setText } = props;
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const eyeIcon = <StyledIcon icon={faEye} />;
  const closeIcon = <StyledIcon icon={faEyeSlash} />;
  const saveIcon = <StyledIcon icon={faSave} />;
  const [html, setHtml] = useState("");

  useEffect(() => {
    convertMarkdownWorker.onmessage = (event) => {
      setHtml(event.data.html);
    };
  }, []);

  useEffect(() => {
    convertMarkdownWorker.postMessage(text);
  }, [text]);

  return (
    <>
      <HeaderArea>
        <Header title="Markdown Editor">
          {showPreview ? (
            <Button onClick={() => setShowPreview(false)}>
              プレビューを非表示{closeIcon}
            </Button>
          ) : (
            <Button onClick={() => setShowPreview(true)}>
              プレビューを表示 {eyeIcon}
            </Button>
          )}
          <Button onClick={() => setShowModal(true)}>保存する{saveIcon}</Button>
          <Link to="/history">履歴を見る</Link>
        </Header>
      </HeaderArea>
      <Wrapper>
        <TextArea
          onChange={(event) => setText(event.target.value)}
          value={text}
          placeholder={"こちらにテキストを入力してください"}
        />
        {showPreview && (
          <Preview>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </Preview>
        )}
      </Wrapper>
      {showModal && (
        <SaveModal
          onSave={(title: string): void => {
            putMemo(title, text);
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
};
