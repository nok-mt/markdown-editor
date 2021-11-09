import * as React from "react";
import styled from "styled-components";
import * as ReactMarkdown from "react-markdown";
import { putMemo } from "../indexeddb/memos";
import { Button } from "../components/button";
import { SaveModal } from "../components/save_modal";
import { Link } from "react-router-dom";
import { Header } from "../components/header";

const { useState } = React;

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
  padding: 0.5rem;
  width: 100%;
`;

const Preview = styled.div`
  border-top: 1px solid silver;
  overflow-y: scroll;
  padding: 1rem;
  width: 100%;
`;

interface Props {
  text: string;
  setText: (text: string) => void;
}

export const Editor: React.FC<Props> = (props) => {
  const { text, setText } = props;
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  return (
    <>
      <HeaderArea>
        <Header title="Markdown Editor">
          {showPreview ? (
            <Button onClick={() => setShowPreview(false)}>
              プレビューを非表示
            </Button>
          ) : (
            <Button onClick={() => setShowPreview(true)}>
              プレビューを表示
            </Button>
          )}
          <Button onClick={() => setShowModal(true)}>保存する</Button>
          <Link to="/history">履歴を見る</Link>
        </Header>
      </HeaderArea>
      <Wrapper>
        <TextArea
          onChange={(event) => setText(event.target.value)}
          value={text}
        />
        {showPreview && (
          <Preview>
            <ReactMarkdown>{text}</ReactMarkdown>
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
