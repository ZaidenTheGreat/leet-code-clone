import { firestore } from "@/firebase/firebase";
import * as React from "react";
import { doc, setDoc } from "firebase/firestore";
export interface IAdminProps {}

export default function Admin(props: IAdminProps) {
  const [inputs, setInputs] = React.useState({
    id: "",
    title: "",
    category: "",
    order: "",
    difficulty: "",
    videoId: "",
    likes: 0,
    dislikes: 0,
  });
  // console.log("inputs", inputs);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };
  console.log(inputs);
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newFormData = {
      ...inputs,
      order: parseInt(inputs.order),
    };
    await setDoc(doc(firestore, "problems", inputs.id), newFormData);
    setInputs({
      id: "",
      title: "",
      category: "",
      order: "",
      difficulty: "",
      videoId: "",
      likes: 0,
      dislikes: 0,
    });
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input type="text" onChange={handleInput} name="id" placeholder="id" />
        <input
          type="text"
          onChange={handleInput}
          name="title"
          placeholder="title"
        />
        <input
          type="text"
          onChange={handleInput}
          name="difficulty"
          placeholder="difficulty"
        />
        <input
          type="text"
          onChange={handleInput}
          name="category"
          placeholder="category"
        />
        <input
          type="number"
          onChange={handleInput}
          name="order"
          placeholder="order"
        />
        <input
          type="text"
          onChange={handleInput}
          name="videoId"
          placeholder="videoId"
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
