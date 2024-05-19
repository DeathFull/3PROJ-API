import mongoose, { Types } from "mongoose";

const debtSchema = new mongoose.Schema({
  receiverId: { type: Types.ObjectId, ref: "User", required: true },
  refunderId: { type: Types.ObjectId, ref: "User", required: true },
  idGroup: { type: Types.ObjectId, ref: "Group", required: true },
  amount: { type: Number, required: true },
});

export const DebtModel = mongoose.model("Debt", debtSchema);

/*
1ère partie de l'algo: (la plus importante)
prendre en compte les liens direct (entre deux personnes uniquement)

doc1={aliceId, bobId, groupId, amount}
doc2={bobId, aliceId, groupId, amount}

calcul
doc1= {aliceId, bobId, groupId, 5}
doc2= {bobId, aliceId, groupId, 20}

const v = Math.min(doc1.amount, doc2.amount) = 5
doc2.amount -= v
doc1.amount -= v

rendu final
doc1= {aliceId, bobId, groupId, 0}
doc2= {bobId, aliceId, groupId, 15}

2ème partie de l'algo:

prendre en compte les liens intermédiaires (entre plusieurs personnes)
doc1={aliceId, bobId, groupId, amount}
doc2={bobId, charlieId, groupId, amount}
doc3={charlieId, aliceId, groupId, amount}

calcul
doc1= {aliceId, bobId, groupId, 5}
doc2= {bobId, charlieId, groupId, 20}
doc3= {charlieId, aliceId, groupId, 10}

const v = Math.min(doc1.amount, doc2.amount, doc3.amount) = 5
doc1.amount -= v
doc2.amount -= v
doc3.amount -= v

rendu final
doc1= {aliceId, bobId, groupId, 0}
doc2= {bobId, charlieId, groupId, 15}
doc3= {charlieId, aliceId, groupId, 5}

3ème partie:
prendre en compte les liens indirects (entre plusieurs personnes)

doc1={aliceId, bobId, groupId, amount}
doc2={bobId, charlieId, groupId, amount}
doc3={charlieId, davidId, groupId, amount}
doc4={davidId, aliceId, groupId, amount}

calcul
doc1= {aliceId, bobId, groupId, 5}
doc2= {bobId, charlieId, groupId, 20}
doc3= {charlieId, davidId, groupId, 10}
doc4= {davidId, aliceId, groupId, 15}

const v = Math.min(doc1.amount, doc2.amount, doc3.amount, doc4.amount) = 5
doc1.amount -= v
doc2.amount -= v
doc3.amount -= v
doc4.amount -= v

rendu final
doc1= {aliceId, bobId, groupId, 0}
doc2= {bobId, charlieId, groupId, 15}
doc3= {charlieId, davidId, groupId, 5}
doc4= {davidId, aliceId, groupId, 10}
 */
