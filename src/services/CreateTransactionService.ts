import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface RequestDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, type, value }: RequestDTO): Transaction {
    if (type !== 'income' && type !== 'outcome') {
      throw new Error(
        'The type of this transaction is invalid. Only income or outcome transactions are allowed.',
      );
    }

    if (type === 'outcome') {
      const balance = this.transactionsRepository.getBalance();

      const { total } = balance;

      if (value > total) {
        throw new Error(
          'Outcome transactions cannot exceed the total balance sheet value.',
        );
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });

    return transaction;
  }
}

export default CreateTransactionService;
