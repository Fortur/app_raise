import React, {useState} from 'react';

const NewBossPopup = ({userId, needRefresh}: { userId: string, needRefresh: Function }) => {
    const [inputOne, setInputOne] = useState<string>('');

    const handleSubmit = async (): Promise<void> => {
        const data = {inputOne};

        try {

            const response = await fetch(`http://localhost:3001/users/${userId}/manager`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "managerId": inputOne
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
                Введите id руководителя для пользователя {userId}
            </p>
            <input
                type='text'
                value={inputOne}
                onChange={(e) => setInputOne(e.target.value)}
                placeholder='id рукводителя'
            />
            <button onClick={handleSubmit}>Подтвердить</button>
            <button onClick={() => {
                needRefresh()
            }}>Отмена
            </button>
        </div>
    );
};

export default NewBossPopup;
