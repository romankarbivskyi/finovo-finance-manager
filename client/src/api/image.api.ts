import axios from "axios";

export const generateImage = async (prompt: string): Promise<File | null> => {
  try {
    const seed = Math.floor(Math.random() * 1000000);
    const response = await axios.get(
      `https://image.pollinations.ai/prompt/${prompt}`,
      {
        responseType: "blob",
        params: {
          width: 1000,
          height: 500,
          nologo: true,
          seed: seed,
        },
      },
    );
    const data = response.data;

    return new File([data], `${Date.now()}.jpeg`, {
      type: data.type,
    });
  } catch (err) {
    console.log(err);

    return null;
  }
};
