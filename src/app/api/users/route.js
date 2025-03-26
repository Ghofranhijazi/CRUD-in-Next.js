import connectDb from '../../../../lib/dbConnect';
import User from '../../../../models/User';


// GET: للحصول على جميع المستخدمين
export const GET = async () => {
  try {
    await connectDb();
    const users = await User.find({ isActive: true });
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response('Error fetching users', { status: 500 });
  }
};

// POST: لإنشاء مستخدم جديد
export const POST = async (req) => {
  try {
    await connectDb();
    const { name, email } = await req.json();
    const newUser = new User({ name, email });
    await newUser.save();
    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    return new Response('Error creating user', { status: 500 });
  }
};

// PUT: لتحديث بيانات مستخدم حسب الـ ID
export const PUT = async (req, { params }) => {
  const { id } = params; // الحصول على الـ ID من المسار
  try {
    await connectDb();
    const { name, email } = await req.json();
    const updatedUser = await User.findByIdAndUpdate(
      id, // استخدام الـ ID لتحديث المستخدم
      { name, email },
      { new: true }
    );
    if (!updatedUser) {
      return new Response('User not found', { status: 404 });
    }
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    return new Response('Error updating user', { status: 500 });
  }
};

// DELETE: لحذف مستخدم (Soft Delete) حسب الـ ID
export const DELETE = async (req, { params }) => {
  const { id } = params; // الحصول على الـ ID من المسار
  try {
    await connectDb();
    const deletedUser = await User.findByIdAndUpdate(
      id, // استخدام الـ ID لحذف المستخدم (تغيير حالته إلى غير نشط)
      { isActive: false },
      { new: true }
    );
    if (!deletedUser) {
      return new Response('User not found', { status: 404 });
    }
    return new Response(JSON.stringify(deletedUser), { status: 200 });
  } catch (error) {
    return new Response('Error deleting user', { status: 500 });
  }
};
