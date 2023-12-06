import React, {useState} from 'react';

const NewUserPopup = ({needRefresh}: { needRefresh: Function }) => {
    const [inputOne, setInputOne] = useState<string>('');

    const handleSubmit = async (): Promise<void> => {
        const data = {inputOne};

        try {

            const response = await fetch(`http://localhost:3001/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "name": inputOne
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            needRefresh()
            console.log('Data sent successfully');
        } catch (error) {
            console.error('Error while sending data:', error);
        }
    };

    return (
        <div className='popup'>
            <p>
                Введите имя для нового пользователя
            </p>
            <input
                type='text'
                value={inputOne}
                onChange={(e) => setInputOne(e.target.value)}
                placeholder='Имя нового пользователя'
            />
            <button onClick={handleSubmit}>Подтвердить</button>
            <button onClick={() => {
                needRefresh()
            }}>Отмена
            </button>
        </div>
    );
};

export default NewUserPopup;
