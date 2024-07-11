//ts needs to know custom methods exist and be aware of them (even if not altering anything)
export interface ICardDataAPI{
    fetchCards: () => Promise<void>,
    saveCard: (cardInfo) => Promise<void>
}


declare global{
    interface Window{
        cardData: ICardDataAPI
    }
}